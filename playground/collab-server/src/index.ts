import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { LoroDoc } from 'loro-crdt';

// Configuration
const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:7901';

// Room-based document storage
interface RoomState {
  doc: LoroDoc;
  peers: Set<string>;
}
const rooms = new Map<string, RoomState>();

// Initialize Fastify
const fastify = Fastify({
  logger: {
    level: 'info',
  },
});

// Register CORS
await fastify.register(cors, {
  origin: CORS_ORIGIN,
  credentials: true,
});

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok', rooms: rooms.size };
});

// Get room list endpoint
fastify.get('/rooms', async () => {
  const roomList = Array.from(rooms.entries()).map(([id, state]) => ({
    id,
    peerCount: state.peers.size,
  }));
  return { rooms: roomList };
});

// Create Socket.IO server
const io = new SocketIOServer(fastify.server, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

// Get or create a room
function getOrCreateRoom(roomId: string): RoomState {
  let room = rooms.get(roomId);
  if (!room) {
    const doc = new LoroDoc();
    room = { doc, peers: new Set() };
    rooms.set(roomId, room);
    fastify.log.info(`Created room: ${roomId}`);
  }
  return room;
}

// Socket.IO event handlers
io.on('connection', (socket) => {
  fastify.log.info(`Client connected: ${socket.id}`);
  let currentRoomId: string | null = null;
  let peerId: string | null = null;

  // Join a room
  socket.on('join-room', (data: { roomId: string; peerId: string }) => {
    const { roomId, peerId: clientPeerId } = data;

    // Leave previous room if any
    if (currentRoomId) {
      socket.leave(currentRoomId);
      const prevRoom = rooms.get(currentRoomId);
      if (prevRoom && peerId) {
        prevRoom.peers.delete(peerId);
        socket.to(currentRoomId).emit('peer-left', { peerId });
      }
    }

    currentRoomId = roomId;
    peerId = clientPeerId;
    socket.join(roomId);

    const room = getOrCreateRoom(roomId);
    room.peers.add(clientPeerId);

    // Notify others about the new peer
    socket.to(roomId).emit('peer-joined', { peerId: clientPeerId });

    // Send current peer list to the new client
    socket.emit('room-joined', {
      roomId,
      peers: Array.from(room.peers),
    });

    fastify.log.info(`Peer ${clientPeerId} joined room ${roomId}`);
  });

  // Handle sync request (initial load)
  socket.on('sync-request', (data: { roomId: string; version?: number[] }) => {
    const { roomId, version } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('sync-error', { error: 'Room not found' });
      return;
    }

    try {
      let snapshot: Uint8Array;
      if (version && version.length > 0) {
        // Send only updates since the given version
        const versionBytes = new Uint8Array(version);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        snapshot = room.doc.export({ mode: 'update', from: versionBytes as any });
      } else {
        // Send full snapshot
        snapshot = room.doc.export({ mode: 'snapshot' });
      }

      socket.emit('sync-response', {
        roomId,
        snapshot: Array.from(snapshot),
        isSnapshot: !version || version.length === 0,
      });

      fastify.log.info(`Sent sync response to ${socket.id} for room ${roomId}`);
    } catch (error) {
      fastify.log.error(`Sync error: ${error}`);
      socket.emit('sync-error', { error: 'Failed to export document' });
    }
  });

  // Handle updates from clients
  socket.on('update', (data: { roomId: string; update: number[]; peerId: string }) => {
    const { roomId, update, peerId: updatePeerId } = data;
    const room = rooms.get(roomId);

    if (!room) {
      fastify.log.warn(`Update for non-existent room: ${roomId}`);
      return;
    }

    try {
      // Import the update into the server's document
      const updateBytes = new Uint8Array(update);
      room.doc.import(updateBytes);

      // Broadcast to all other clients in the room
      socket.to(roomId).emit('remote-update', {
        roomId,
        update,
        peerId: updatePeerId,
      });

      fastify.log.debug(`Broadcasted update from ${updatePeerId} in room ${roomId}`);
    } catch (error) {
      fastify.log.error(`Update import error: ${error}`);
    }
  });

  // Handle schema initialization (first client sets the initial state)
  socket.on('init-schema', (data: { roomId: string; snapshot: number[] }) => {
    const { roomId, snapshot } = data;
    const room = rooms.get(roomId);

    if (!room) {
      fastify.log.warn(`Init schema for non-existent room: ${roomId}`);
      return;
    }

    // Only accept if document is empty
    const currentState = room.doc.toJSON();
    if (Object.keys(currentState).length === 0) {
      try {
        const snapshotBytes = new Uint8Array(snapshot);
        room.doc.import(snapshotBytes);
        fastify.log.info(`Initialized schema for room ${roomId}`);
      } catch (error) {
        fastify.log.error(`Schema init error: ${error}`);
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (currentRoomId && peerId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.peers.delete(peerId);
        socket.to(currentRoomId).emit('peer-left', { peerId });

        // Clean up empty rooms after a delay
        if (room.peers.size === 0) {
          setTimeout(() => {
            const currentRoom = rooms.get(currentRoomId!);
            if (currentRoom && currentRoom.peers.size === 0) {
              rooms.delete(currentRoomId!);
              fastify.log.info(`Cleaned up empty room: ${currentRoomId}`);
            }
          }, 30000); // 30 second delay before cleanup
        }
      }
    }
    fastify.log.info(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Collaboration server running on http://localhost:${PORT}`);
    fastify.log.info(`Accepting connections from: ${CORS_ORIGIN}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
