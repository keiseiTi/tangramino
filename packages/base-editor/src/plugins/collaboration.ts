import type { Schema } from '@tangramino/engine';
import type { EditorPlugin, PluginContext } from '../interface/plugin';
import { definePlugin } from '../utils/define-plugin';

// Type definitions for Socket.IO client (peer dependency)
interface Socket {
  connected: boolean;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback?: (...args: unknown[]) => void): void;
  emit(event: string, ...args: unknown[]): void;
  connect(): void;
  disconnect(): void;
}

interface SocketIOClient {
  (url: string, options?: Record<string, unknown>): Socket;
}

// Type definitions for Loro (peer dependency)
interface LoroDoc {
  setPeerId(id: bigint | string): void;
  getMap(id: string): LoroMap;
  subscribe(callback: (event: LoroEvent) => void): () => void;
  export(options: { mode: 'snapshot' } | { mode: 'update'; from?: Uint8Array }): Uint8Array;
  import(data: Uint8Array): void;
  toJSON(): unknown;
  version(): Uint8Array;
  commit(): void;
}

interface LoroMap {
  set(key: string, value: unknown): void;
  get(key: string): unknown;
  delete(key: string): void;
  getOrCreateContainer(key: string, type: 'Map'): LoroMap;
  toJSON(): Record<string, unknown>;
  entries(): IterableIterator<[string, unknown]>;
}

interface LoroEvent {
  origin: 'local' | 'import' | 'checkout';
  local: boolean;
}

/**
 * Collaboration plugin configuration options
 */
export interface CollaborationOptions {
  /** WebSocket server URL */
  serverUrl: string;
  /** Room ID for collaboration session */
  roomId: string;
  /** Optional peer ID for identification (will be converted to BigInt for Loro) */
  peerId?: string | bigint;
  /** Auto-connect on init (default: true) */
  autoConnect?: boolean;
  /** Loro CRDT library instance (must be provided) */
  loro: { LoroDoc: new () => LoroDoc };
  /** Socket.IO client instance (must be provided) */
  socketIO: SocketIOClient;
}

/**
 * Collaboration plugin extension interface
 */
export interface CollaborationPluginExtension {
  /** Connect to the collaboration server */
  connect: () => Promise<void>;
  /** Disconnect from the collaboration server */
  disconnect: () => void;
  /** Check if connected */
  isConnected: () => boolean;
  /** Get list of connected peer IDs */
  getPeers: () => string[];
  /** Get current room ID */
  getRoomId: () => string;
}

/**
 * Collaboration plugin type
 */
export type CollaborationPlugin = EditorPlugin & CollaborationPluginExtension;

// Helper: Generate random peer ID as BigInt (required by Loro)
const generatePeerId = (): bigint => {
  // Generate a random 53-bit integer (safe for JavaScript)
  // and convert to BigInt for Loro
  const randomInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  return BigInt(randomInt);
};

/**
 * Collaboration plugin - provides real-time collaborative editing using Loro CRDT
 *
 * @example
 * import { LoroDoc } from 'loro-crdt';
 * import { io } from 'socket.io-client';
 *
 * const collab = collaborationPlugin({
 *   serverUrl: 'http://localhost:3001',
 *   roomId: 'my-document',
 *   loro: { LoroDoc },
 *   socketIO: io,
 * });
 */
export const collaborationPlugin = definePlugin<CollaborationPlugin, CollaborationOptions>(
  (options) => {
    const { serverUrl, roomId, peerId: userPeerId, autoConnect = true, loro, socketIO } = options;

    // State
    let loroDoc: LoroDoc | null = null;
    let socket: Socket | null = null;
    let ctx: PluginContext | null = null;
    let isRemoteUpdate = false;
    let isInitialSync = true;
    // Convert peerId to BigInt for Loro, keep string version for Socket.IO
    const loroPeerId: bigint = typeof userPeerId === 'bigint'
      ? userPeerId
      : typeof userPeerId === 'string'
        ? BigInt(parseInt(userPeerId, 10) || Date.now())
        : generatePeerId();
    const socketPeerId: string = loroPeerId.toString();
    const peers: Set<string> = new Set();
    let unsubscribeLoro: (() => void) | null = null;

    // Convert Schema to Loro document structure
    // Store the entire schema as a JSON string to avoid Loro Map nesting issues
    const schemaToLoro = (schema: Schema): void => {
      if (!loroDoc) return;

      const rootMap = loroDoc.getMap('root');
      // Serialize entire schema as JSON string
      rootMap.set('schema', JSON.stringify(schema));
      loroDoc.commit();
    };

    // Convert Loro document to Schema
    const loroToSchema = (): Schema | null => {
      if (!loroDoc) return null;

      try {
        const rootMap = loroDoc.getMap('root');
        const schemaJson = rootMap.get('schema');

        if (!schemaJson || typeof schemaJson !== 'string') {
          return null;
        }

        const schema = JSON.parse(schemaJson) as Schema;
        return schema;
      } catch (error) {
        console.error('[collaborationPlugin] Failed to convert Loro to Schema:', error);
        return null;
      }
    };

    // Sync local changes to server
    const syncToServer = (targetSchema?: Schema): void => {
      console.log('[collaborationPlugin] syncToServer called', {
        socketConnected: socket?.connected,
        hasLoroDoc: !!loroDoc,
        isRemoteUpdate,
        isInitialSync,
        hasTargetSchema: !!targetSchema,
      });

      if (!socket?.connected || !loroDoc || isRemoteUpdate || isInitialSync) return;

      try {
        const schemaToSync = targetSchema || ctx?.getSchema();
        if (schemaToSync) {
          schemaToLoro(schemaToSync);
        }

        const update = loroDoc.export({ mode: 'update' });

        // Only send if there are actual updates
        if (update.length > 0) {
          console.log('[collaborationPlugin] Sending update to server, size:', update.length);
          socket.emit('update', {
            roomId,
            update: Array.from(update),
            peerId: socketPeerId,
          });
        }
      } catch (error) {
        console.error('[collaborationPlugin] Failed to sync to server:', error);
      }
    };

    // Connect to server
    const connect = async (): Promise<void> => {
      if (socket?.connected) return;

      return new Promise((resolve, reject) => {
        try {
          socket = socketIO(serverUrl, {
            transports: ['websocket', 'polling'],
          });

          socket.on('connect', () => {
            console.log('[collaborationPlugin] Connected to server');
            socket!.emit('join-room', { roomId, peerId: socketPeerId });
          });

          socket.on('room-joined', (data: { roomId: string; peers: string[] }) => {
            peers.clear();
            data.peers.forEach((p) => peers.add(p));
            console.log('[collaborationPlugin] Joined room:', data.roomId, 'Peers:', data.peers);

            // Request sync after joining
            socket!.emit('sync-request', { roomId });
          });

          socket.on(
            'sync-response',
            (data: { roomId: string; snapshot: number[]; isSnapshot: boolean }) => {
              if (!loroDoc) return;

              try {
                const snapshotBytes = new Uint8Array(data.snapshot);
                if (snapshotBytes.length > 0) {
                  loroDoc.import(snapshotBytes);
                  const schema = loroToSchema();
                  if (schema && ctx) {
                    isRemoteUpdate = true;
                    ctx.setSchema(schema);
                    isRemoteUpdate = false;
                  }
                } else if (ctx) {
                  // Server document is empty, initialize with our schema
                  const currentSchema = ctx.getSchema();
                  schemaToLoro(currentSchema);
                  const snapshot = loroDoc!.export({ mode: 'snapshot' });
                  socket!.emit('init-schema', {
                    roomId,
                    snapshot: Array.from(snapshot),
                  });
                }
                isInitialSync = false;
                resolve();
              } catch (error) {
                console.error('[collaborationPlugin] Sync error:', error);
                reject(error);
              }
            },
          );

          socket.on('remote-update', (data: { roomId: string; update: number[]; peerId: string }) => {
            if (!loroDoc || data.peerId === socketPeerId) return;

            try {
              const updateBytes = new Uint8Array(data.update);
              loroDoc.import(updateBytes);

              const schema = loroToSchema();
              if (schema && ctx) {
                isRemoteUpdate = true;
                ctx.setSchema(schema);
                isRemoteUpdate = false;
              }
            } catch (error) {
              console.error('[collaborationPlugin] Remote update error:', error);
            }
          });

          socket.on('peer-joined', (data: { peerId: string }) => {
            peers.add(data.peerId);
            console.log('[collaborationPlugin] Peer joined:', data.peerId);
          });

          socket.on('peer-left', (data: { peerId: string }) => {
            peers.delete(data.peerId);
            console.log('[collaborationPlugin] Peer left:', data.peerId);
          });

          socket.on('connect_error', (error: Error) => {
            console.error('[collaborationPlugin] Connection error:', error.message);
            reject(error);
          });

          socket.on('disconnect', () => {
            console.log('[collaborationPlugin] Disconnected from server');
          });
        } catch (error) {
          reject(error);
        }
      });
    };

    // Disconnect from server
    const disconnect = (): void => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      peers.clear();
      isInitialSync = true;
    };

    return {
      id: 'collaboration',
      priority: 10, // Run after history plugin

      onInit(context: PluginContext) {
        console.log('[collaborationPlugin] onInit called, peerId:', loroPeerId.toString());
        ctx = context;

        // Initialize Loro document
        loroDoc = new loro.LoroDoc();
        loroDoc.setPeerId(loroPeerId);

        // Subscribe to loro changes
        unsubscribeLoro = loroDoc.subscribe((event: LoroEvent) => {
          // Handle only imports from remote
          if (event.origin === 'import' && !event.local) {
            const schema = loroToSchema();
            if (schema && ctx) {
              isRemoteUpdate = true;
              ctx.setSchema(schema);
              isRemoteUpdate = false;
            }
          }
        });

        // Initialize loro with current schema
        const initialSchema = context.getSchema();
        schemaToLoro(initialSchema);

        // Auto-connect if enabled
        if (autoConnect) {
          connect().catch((error) => {
            console.error('[collaborationPlugin] Auto-connect failed:', error);
          });
        }

        return () => {
          console.log('[collaborationPlugin] onDispose called');
          disconnect();
          if (unsubscribeLoro) {
            unsubscribeLoro();
            unsubscribeLoro = null;
          }
          loroDoc = null;
          ctx = null;
        };
      },

      // Hook schema changes to sync
      onBeforeInsert() {
        console.log('[collaborationPlugin] onBeforeInsert called');
      },

      onAfterInsert(schema: Schema) {
        console.log('[collaborationPlugin] onAfterInsert calling syncToServer');
        syncToServer(schema);
      },

      onBeforeMove() {
        console.log('[collaborationPlugin] onBeforeMove called');
      },

      onAfterMove(schema: Schema) {
        console.log('[collaborationPlugin] onAfterMove calling syncToServer');
        syncToServer(schema);
      },

      onBeforeRemove() {
        console.log('[collaborationPlugin] onBeforeRemove called');
      },

      onAfterRemove(schema: Schema) {
        console.log('[collaborationPlugin] onAfterRemove calling syncToServer');
        syncToServer(schema);
      },

      onBeforeUpdateProps() {
        console.log('[collaborationPlugin] onBeforeUpdateProps called');
      },

      onAfterUpdateProps(schema: Schema) {
        console.log('[collaborationPlugin] onAfterUpdateProps calling syncToServer');
        syncToServer(schema);
      },

      // Extension methods
      connect,
      disconnect,
      isConnected: () => socket?.connected ?? false,
      getPeers: () => Array.from(peers),
      getRoomId: () => roomId,
    };
  },
);
