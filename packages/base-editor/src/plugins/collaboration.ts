import type { Schema } from '@tangramino/engine';
import type { EditorPlugin, PluginContext } from '../interface/plugin';
import { definePlugin } from '../utils/define-plugin';
import { LoroDoc as LoroDocClass } from 'loro-crdt';

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
  (uri?: string, options?: Record<string, unknown>): Socket;
  (options?: Record<string, unknown>): Socket;
}

// Type definitions for Loro (peer dependency)
interface LoroDoc {
  setPeerId(id: bigint | number | `${number}`): void;
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
  /** Socket.IO client instance (must be provided) */
  socketIO: SocketIOClient;
  /** Max retry attempts for sync (default: 5) */
  maxRetries?: number;
  /** Initial retry delay in ms (default: 1000) */
  retryDelay?: number;
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

// Helper: Validate peer ID format
const isValidPeerId = (peerId: unknown): peerId is string => {
  return typeof peerId === 'string' && peerId.length > 0 && /^[a-zA-Z0-9_-]+$/.test(peerId);
};

/**
 * Collaboration plugin - provides real-time collaborative editing using Loro CRDT
 *
 * @example
 * import { io } from 'socket.io-client';
 *
 * const collab = collaborationPlugin({
 *   serverUrl: 'http://localhost:3001',
 *   roomId: 'my-document',
 *   socketIO: io,
 * });
 */
export const collaborationPlugin = definePlugin<CollaborationPlugin, CollaborationOptions>(
  (options) => {
    const {
      serverUrl,
      roomId,
      peerId: userPeerId,
      autoConnect = true,
      socketIO,
      maxRetries = 5,
      retryDelay = 1000,
    } = options;

    // State
    let loroDoc: LoroDoc | null = null;
    let socket: Socket | null = null;
    let ctx: PluginContext | null = null;
    let isRemoteUpdate = false;
    let isInitialSync = true;
    let retryCount = 0;
    let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
    // Convert peerId to BigInt for Loro, keep string version for Socket.IO
    const loroPeerId: bigint =
      typeof userPeerId === 'bigint'
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
      if (!socket?.connected || !loroDoc || isRemoteUpdate || isInitialSync) return;

      try {
        const schemaToSync = targetSchema || ctx?.getSchema();
        if (schemaToSync) {
          schemaToLoro(schemaToSync);
        }

        const update = loroDoc.export({ mode: 'update' });

        // Only send if there are actual updates
        if (update.length > 0) {
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

    // Exponential backoff retry
    const retryConnect = (): void => {
      if (retryCount >= maxRetries) {
        console.error(
          `[collaborationPlugin] Max retry attempts (${maxRetries}) reached. Giving up.`,
        );
        return;
      }

      const delay = retryDelay * Math.pow(2, retryCount);
      retryCount++;

      console.log(
        `[collaborationPlugin] Retrying connection in ${delay}ms (attempt ${retryCount}/${maxRetries})...`,
      );

      retryTimeoutId = setTimeout(() => {
        connect().catch((error) => {
          console.error('[collaborationPlugin] Retry failed:', error);
          retryConnect();
        });
      }, delay);
    };

    // Connect to server
    const connect = async (): Promise<void> => {
      if (socket?.connected) return;

      // Clear any pending retry
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }

      return new Promise((resolve, reject) => {
        try {
          socket = socketIO(serverUrl, {
            transports: ['websocket', 'polling'],
          });

          socket.on('connect', () => {
            socket!.emit('join-room', { roomId, peerId: socketPeerId });
          });

          socket.on('room-joined', (data: { roomId: string; peers: string[] }) => {
            peers.clear();
            data.peers.forEach((p) => peers.add(p));

            // Request sync after joining
            socket!.emit('sync-request', { roomId });
          });

          socket.on(
            'sync-response',
            (data: { roomId: string; snapshot: number[]; isSnapshot: boolean }) => {
              if (!loroDoc) {
                console.error('[collaborationPlugin] Loro document not initialized');
                reject(new Error('Loro document not initialized'));
                return;
              }

              try {
                const snapshotBytes = new Uint8Array(data.snapshot);
                if (snapshotBytes.length > 0) {
                  loroDoc.import(snapshotBytes);
                  const schema = loroToSchema();
                  if (schema && ctx) {
                    isRemoteUpdate = true;
                    ctx.setSchema(schema);
                    isRemoteUpdate = false;
                  } else if (!schema) {
                    console.warn('[collaborationPlugin] Failed to parse schema from sync response');
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
                retryCount = 0; // Reset retry count on success
                resolve();
              } catch (error) {
                console.error('[collaborationPlugin] Sync error:', error);
                // Retry on sync error
                retryConnect();
                reject(error);
              }
            },
          );

          socket.on(
            'remote-update',
            (data: { roomId: string; update: number[]; peerId: string }) => {
              if (!loroDoc || data.peerId === socketPeerId) return;

              // Validate peerId format
              if (!isValidPeerId(data.peerId)) {
                console.warn(
                  `[collaborationPlugin] Invalid peerId format received: ${data.peerId}`,
                );
                return;
              }

              // Validate roomId matches
              if (data.roomId !== roomId) {
                console.warn(
                  `[collaborationPlugin] Received update for different room: ${data.roomId}`,
                );
                return;
              }

              // Validate update data
              if (!Array.isArray(data.update) || data.update.length === 0) {
                console.warn('[collaborationPlugin] Invalid update data received');
                return;
              }

              try {
                const updateBytes = new Uint8Array(data.update);
                loroDoc.import(updateBytes);

                const schema = loroToSchema();
                if (schema && ctx) {
                  isRemoteUpdate = true;
                  ctx.setSchema(schema);
                  isRemoteUpdate = false;
                } else if (!schema) {
                  console.warn('[collaborationPlugin] Failed to parse schema from remote update');
                }
              } catch (error) {
                console.error('[collaborationPlugin] Remote update error:', error);
              }
            },
          );

          socket.on('peer-joined', (data: { peerId: string }) => {
            peers.add(data.peerId);
          });

          socket.on('peer-left', (data: { peerId: string }) => {
            peers.delete(data.peerId);
          });

          socket.on('connect_error', (error: Error) => {
            console.error('[collaborationPlugin] Connection error:', error.message);
            reject(error);
            // Trigger retry on connection error
            retryConnect();
          });

          socket.on('disconnect', (reason: string) => {
            console.log(`[collaborationPlugin] Disconnected: ${reason}`);
            // Auto-reconnect on unexpected disconnection
            if (reason === 'io server disconnect') {
              // Server initiated disconnect, retry connection
              retryConnect();
            }
            // For other reasons, Socket.IO handles auto-reconnect
          });
        } catch (error) {
          reject(error);
        }
      });
    };

    // Disconnect from server
    const disconnect = (): void => {
      // Clear retry timeout
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }

      // Reset retry count
      retryCount = 0;

      // Disconnect socket and remove all listeners
      if (socket) {
        socket.off('connect');
        socket.off('room-joined');
        socket.off('sync-response');
        socket.off('remote-update');
        socket.off('peer-joined');
        socket.off('peer-left');
        socket.off('connect_error');
        socket.off('disconnect');
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
        ctx = context;

        // Initialize Loro document
        const _loroDoc = new LoroDocClass();
        loroDoc = _loroDoc as unknown as LoroDoc;
        if (loroDoc) {
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
        }

        // Auto-connect if enabled
        if (autoConnect) {
          connect().catch((error) => {
            console.error('[collaborationPlugin] Auto-connect failed:', error);
          });
        }

        return () => {
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
      onBeforeInsert() {},

      onAfterInsert(schema: Schema) {
        syncToServer(schema);
      },

      onBeforeMove() {},

      onAfterMove(schema: Schema) {
        syncToServer(schema);
      },

      onBeforeRemove() {},

      onAfterRemove(schema: Schema) {
        syncToServer(schema);
      },

      onBeforeUpdateProps() {},

      onAfterUpdateProps(schema: Schema) {
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
