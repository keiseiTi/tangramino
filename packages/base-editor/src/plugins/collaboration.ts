import type { Schema } from '@tangramino/engine';
import type {
  EditorPlugin,
  PluginContext,
  InsertOperation,
  MoveOperation,
  RemoveOperation,
  UpdatePropsOperation,
} from '../interface/plugin';
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
  getOrCreateContainer(key: string, type: 'Map' | 'List'): LoroMap | LoroList;
  toJSON(): Record<string, unknown>;
  entries(): IterableIterator<[string, unknown]>;
  length: number;
}

interface LoroList {
  insert(index: number, value: unknown): void;
  delete(index: number, len: number): void;
  get(index: number): unknown;
  clear(): void;
  toJSON(): unknown[];
  length: number;
}

interface LoroEvent {
  by: 'local' | 'import' | 'checkout';
  origin: string;
  events: unknown[];
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

  // Incremental update methods (for advanced usage)
  /** Update element properties incrementally */
  updateElementProps?: (elementId: string, props: Record<string, unknown>) => void;
  /** Insert element incrementally */
  insertElement?: (
    elementId: string,
    element: { type: string; props: Record<string, unknown>; hidden?: boolean },
    parentId: string,
    index?: number,
  ) => void;
  /** Remove element incrementally */
  removeElement?: (elementId: string, parentId: string) => void;
  /** Move element incrementally */
  moveElement?: (
    elementId: string,
    oldParentId: string,
    newParentId: string,
    newIndex?: number,
  ) => void;
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
 * This plugin implements incremental synchronization using Loro's structured CRDT containers:
 * - Schema elements are mapped to nested Loro Maps and Lists
 * - Each operation generates minimal update patches automatically
 * - Loro handles conflict resolution and consistency across peers
 *
 * Architecture:
 * ```
 * LoroMap (root)
 * ├─ LoroMap (elements) → { [id]: LoroMap(ElementState) }
 * ├─ LoroMap (layout)
 * │  ├─ String (root)
 * │  └─ LoroMap (structure) → { [parentId]: LoroList([childIds]) }
 * ├─ LoroMap (flows) → nested structure
 * └─ LoroList (imports, bindElements)
 * ```
 *
 * Note: Current hook API (onAfterInsert, onAfterMove, etc.) only provides final schema.
 * For true per-operation incremental sync, use the exported incremental methods:
 * - updateElementProps()
 * - insertElement()
 * - removeElement()
 * - moveElement()
 *
 * @example
 * import { io } from 'socket.io-client';
 *
 * const collab = collaborationPlugin({
 *   serverUrl: 'http://localhost:3001',
 *   roomId: 'my-document',
 *   socketIO: io,
 * });
 *
 * // Use incremental methods for fine-grained sync (advanced)
 * collab.insertElement?.('elem-1', { type: 'button', props: {} }, 'root', 0);
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

    // Convert Schema to Loro document structure (structured mapping)
    const schemaToLoro = (schema: Schema): void => {
      if (!loroDoc) return;

      try {
        const rootMap = loroDoc.getMap('root');

        // Map elements: flatten to avoid nested container issues
        Object.entries(schema.elements).forEach(([id, element]) => {
          rootMap.set(`element_${id}_type`, element.type);
          rootMap.set(`element_${id}_props`, JSON.stringify(element.props));
          if (element.hidden !== undefined) {
            rootMap.set(`element_${id}_hidden`, element.hidden);
          }
        });

        // Store element IDs list
        rootMap.set('elementIds', JSON.stringify(Object.keys(schema.elements)));

        // Map layout
        rootMap.set('layout_root', schema.layout.root);

        // Map layout structure: flatten structure
        Object.entries(schema.layout.structure).forEach(([parentId, children]) => {
          rootMap.set(`structure_${parentId}`, JSON.stringify(children));
        });

        // Map flows (if exists)
        if (schema.flows) {
          rootMap.set('flows', JSON.stringify(schema.flows));
        }

        // Map bindElements (if exists)
        if (schema.bindElements) {
          rootMap.set('bindElements', JSON.stringify(schema.bindElements));
        }

        // Map imports (if exists)
        if (schema.imports) {
          rootMap.set('imports', JSON.stringify(schema.imports));
        }

        // Map context (if exists)
        if (schema.context) {
          rootMap.set('context', JSON.stringify(schema.context));
        }

        // Map extensions
        if (schema.extensions) {
          rootMap.set('extensions', JSON.stringify(schema.extensions));
        }

        loroDoc.commit();
      } catch (error) {
        console.error('[collaborationPlugin] Error in schemaToLoro:', error);
        throw error;
      }
    };

    // Convert Loro document to Schema
    const loroToSchema = (): Schema | null => {
      if (!loroDoc) return null;

      try {
        const rootMap = loroDoc.getMap('root');
        const rootData = rootMap.toJSON() as Record<string, unknown>;

        // Reconstruct elements from flattened format
        const elementIds = rootData.elementIds
          ? JSON.parse(rootData.elementIds as string)
          : [];
        const elements: Schema['elements'] = {};

        for (const id of elementIds) {
          const type = rootData[`element_${id}_type`] as string;
          const propsStr = rootData[`element_${id}_props`] as string;
          const hidden = rootData[`element_${id}_hidden`] as boolean | undefined;

          elements[id] = {
            type,
            props: propsStr ? JSON.parse(propsStr) : {},
            ...(hidden !== undefined && { hidden }),
          };
        }

        // Extract layout
        const root = (rootData.layout_root as string) || '';
        const structure: Schema['layout']['structure'] = {};

        // Reconstruct structure from flattened format
        Object.keys(rootData).forEach((key) => {
          if (key.startsWith('structure_')) {
            const parentId = key.substring('structure_'.length);
            structure[parentId] = JSON.parse(rootData[key] as string);
          }
        });

        const schema: Schema = {
          elements,
          layout: { root, structure },
          extensions: {},
        };

        // Extract flows (if exists)
        if (rootData.flows) {
          schema.flows = JSON.parse(rootData.flows as string);
        }

        // Extract bindElements (if exists)
        if (rootData.bindElements) {
          schema.bindElements = JSON.parse(rootData.bindElements as string);
        }

        // Extract imports (if exists)
        if (rootData.imports) {
          schema.imports = JSON.parse(rootData.imports as string);
        }

        // Extract context (if exists)
        if (rootData.context) {
          schema.context = JSON.parse(rootData.context as string);
        }

        // Extract extensions (if exists)
        if (rootData.extensions) {
          schema.extensions = JSON.parse(rootData.extensions as string);
        }

        return schema;
      } catch (error) {
        console.error('[collaborationPlugin] Failed to convert Loro to Schema:', error);
        return null;
      }
    };

    // Incremental update functions for specific operations

    // Update a single element's properties incrementally
    const updateElementProps = (elementId: string, props: Record<string, unknown>): void => {
      if (!loroDoc) return;

      const rootMap = loroDoc.getMap('root');
      rootMap.set(`element_${elementId}_props`, JSON.stringify(props));
      loroDoc.commit();
    };

    // Insert a new element incrementally
    const insertElement = (
      elementId: string,
      element: { type: string; props: Record<string, unknown>; hidden?: boolean },
      parentId: string,
      index?: number,
    ): void => {
      if (!loroDoc) return;

      console.log('[collaboration] insertElement:', { elementId, element, parentId, index });

      const rootMap = loroDoc.getMap('root');

      // Add to elements (flattened)
      rootMap.set(`element_${elementId}_type`, element.type);
      rootMap.set(`element_${elementId}_props`, JSON.stringify(element.props));
      if (element.hidden !== undefined) {
        rootMap.set(`element_${elementId}_hidden`, element.hidden);
      }

      // Update elementIds list
      const elementIdsStr = rootMap.get('elementIds') as string | undefined;
      const elementIds = elementIdsStr ? JSON.parse(elementIdsStr) : [];
      if (!elementIds.includes(elementId)) {
        elementIds.push(elementId);
        rootMap.set('elementIds', JSON.stringify(elementIds));
      }

      // Update layout structure
      const structureKey = `structure_${parentId}`;
      const childrenStr = rootMap.get(structureKey) as string | undefined;
      const children = childrenStr ? JSON.parse(childrenStr) : [];

      if (index !== undefined && index >= 0 && index <= children.length) {
        children.splice(index, 0, elementId);
      } else {
        children.push(elementId);
      }

      rootMap.set(structureKey, JSON.stringify(children));

      console.log('[collaboration] Before commit, calling loroDoc.commit()');
      loroDoc.commit();
      console.log('[collaboration] After commit');
    };

    // Remove an element incrementally
    const removeElement = (elementId: string, parentId: string): void => {
      if (!loroDoc) return;

      const rootMap = loroDoc.getMap('root');

      // Remove from elements (delete flattened keys)
      rootMap.delete(`element_${elementId}_type`);
      rootMap.delete(`element_${elementId}_props`);
      rootMap.delete(`element_${elementId}_hidden`);

      // Update elementIds list
      const elementIdsStr = rootMap.get('elementIds') as string | undefined;
      const elementIds = elementIdsStr ? JSON.parse(elementIdsStr) : [];
      const newElementIds = elementIds.filter((id: string) => id !== elementId);
      rootMap.set('elementIds', JSON.stringify(newElementIds));

      // Remove from layout structure
      const structureKey = `structure_${parentId}`;
      const childrenStr = rootMap.get(structureKey) as string | undefined;
      const children = childrenStr ? JSON.parse(childrenStr) : [];
      const newChildren = children.filter((id: string) => id !== elementId);
      rootMap.set(structureKey, JSON.stringify(newChildren));

      loroDoc.commit();
    };

    // Move an element incrementally
    const moveElement = (
      elementId: string,
      oldParentId: string,
      newParentId: string,
      newIndex?: number,
    ): void => {
      if (!loroDoc) return;

      const rootMap = loroDoc.getMap('root');

      // Remove from old parent
      const oldStructureKey = `structure_${oldParentId}`;
      const oldChildrenStr = rootMap.get(oldStructureKey) as string | undefined;
      const oldChildren = oldChildrenStr ? JSON.parse(oldChildrenStr) : [];
      const newOldChildren = oldChildren.filter((id: string) => id !== elementId);
      rootMap.set(oldStructureKey, JSON.stringify(newOldChildren));

      // Add to new parent
      const newStructureKey = `structure_${newParentId}`;
      const newChildrenStr = rootMap.get(newStructureKey) as string | undefined;
      const newChildren = newChildrenStr ? JSON.parse(newChildrenStr) : [];

      if (newIndex !== undefined && newIndex >= 0 && newIndex <= newChildren.length) {
        newChildren.splice(newIndex, 0, elementId);
      } else {
        newChildren.push(elementId);
      }

      rootMap.set(newStructureKey, JSON.stringify(newChildren));

      loroDoc.commit();
    };

    // Connection management
    const connect = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socketIO) {
          reject(new Error('[collaborationPlugin] SocketIO client not provided'));
          return;
        }

        if (socket?.connected) {
          console.warn('[collaborationPlugin] Socket already connected');
          resolve();
          return;
        }

        // Create Socket instance
        socket = socketIO(serverUrl, {
          reconnection: true,
          reconnectionDelay: retryDelay,
          reconnectionAttempts: maxRetries,
          transports: ['websocket'],
          upgrade: false,
        });

        // Set Loro peer ID
        if (loroDoc) {
          loroDoc.setPeerId(loroPeerId);
        }

        // Handle connection errors
        socket.on('connect_error', (error) => {
          console.error('[collaborationPlugin] Connection error:', error);
          retryCount++;
          if (retryCount >= maxRetries) {
            reject(error);
          }
        });

        // Handle disconnection
        socket.on('disconnect', (reason) => {
          console.warn('[collaborationPlugin] Disconnected:', reason);
          if (reason === 'io server disconnect') {
            // Server disconnected us, try to reconnect
            if (retryCount < maxRetries) {
              retryTimeoutId = setTimeout(() => {
                socket?.connect();
              }, retryDelay * Math.pow(2, retryCount));
              retryCount++;
            }
          }
        });

        // Handle messages from other peers
        socket.on(
          'remote-update',
          (data: { roomId: string; update: number[]; peerId: string }) => {
            console.log('[collaboration] Remote update received:', {
              fromPeer: data.peerId,
              updateLength: data.update.length,
              ourPeerId: socketPeerId,
            });

            if (!loroDoc || data.peerId === socketPeerId) {
              console.log('[collaboration] Ignoring update from self');
              return;
            }

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
              console.log('[collaboration] Importing remote update into Loro');
              loroDoc.import(updateBytes);

              // Automatically update schema after remote import
              const schema = loroToSchema();
              if (schema && ctx) {
                isRemoteUpdate = true;
                ctx.setSchema(schema);
                isRemoteUpdate = false;
                console.log('[collaboration] Schema parsed from remote update: success');
                console.log('[collaboration] Schema updated from remote update');
              } else if (!schema) {
                console.error('[collaboration] Schema parsed from remote update: failed');
              }
            } catch (error) {
              console.error('[collaborationPlugin] Failed to apply remote update:', error);
            }
          },
        );

        socket.on('connect', () => {
          console.log('[collaboration] Socket connected, joining room:', roomId);
          socket!.emit('join-room', { roomId, peerId: socketPeerId });
        });

        socket.on('room-joined', (data: { roomId: string; peers: string[] }) => {
          console.log('[collaboration] Room joined:', data);
          peers.clear();
          data.peers.forEach((p) => peers.add(p));

          // Request sync after joining
          console.log('[collaboration] Requesting sync from server');
          socket!.emit('sync-request', { roomId });
        });

        socket.on(
          'sync-response',
          (data: { snapshot: number[]; isSnapshot: boolean }) => {
            console.log('[collaboration] Sync response received:', {
              snapshotLength: data.snapshot.length,
              isSnapshot: data.isSnapshot,
            });

            if (!loroDoc) {
              console.error('[collaborationPlugin] Loro document not initialized');
              reject(new Error('Loro document not initialized'));
              return;
            }

            try {
              const snapshotBytes = new Uint8Array(data.snapshot);
              if (snapshotBytes.length > 0) {
                console.log('[collaboration] Importing snapshot into Loro');
                loroDoc.import(snapshotBytes);
                const schema = loroToSchema();
                if (schema && ctx) {
                  isRemoteUpdate = true;
                  ctx.setSchema(schema);
                  isRemoteUpdate = false;
                  console.log('[collaboration] Schema updated from sync response');
                } else if (!schema) {
                  console.warn(
                    '[collaborationPlugin] Failed to parse schema from sync response',
                  );
                }
              } else if (ctx) {
                console.log(
                  '[collaboration] Server document is empty, initializing with our schema',
                );
                // Server document is empty, initialize with our schema
                const currentSchema = ctx.getSchema();
                schemaToLoro(currentSchema);
                const snapshot = loroDoc!.export({ mode: 'snapshot' });
                console.log(
                  '[collaboration] Sending initial snapshot to server:',
                  snapshot.length,
                  'bytes',
                );
                socket!.emit('init-schema', {
                  roomId,
                  snapshot: Array.from(snapshot),
                });
              }
              isInitialSync = false;
              console.log('[collaboration] Initial sync completed, isInitialSync = false');
              retryCount = 0; // Reset retry count on success
              resolve();
            } catch (error) {
              console.error('[collaborationPlugin] Failed to handle sync response:', error);
              reject(error);
            }
          },
        );
      });
    };

    const disconnect = (): void => {
      isRemoteUpdate = false;

      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }

      if (unsubscribeLoro) {
        unsubscribeLoro();
        unsubscribeLoro = null;
      }

      if (socket) {
        socket.off('connect');
        socket.off('remote-update');
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

        // Subscribe to Loro changes
        unsubscribeLoro = loroDoc.subscribe((event) => {
          console.log('[collaboration] Loro subscribe event:', {
            by: event.by,
            origin: event.origin,
            isRemoteUpdate,
            isInitialSync,
            socketConnected: socket?.connected,
          });

          // Handle imports from remote (other users' changes)
          if (event.by === 'import') {
            console.log('[collaboration] Handling remote import');
            const schema = loroToSchema();
            if (schema && ctx) {
              isRemoteUpdate = true;
              ctx.setSchema(schema);
              isRemoteUpdate = false;
              console.log('[collaboration] Schema updated from remote import');
            }
          }

          // Handle local commits (our changes) - send to server
          if (event.by === 'local' && socket?.connected && !isRemoteUpdate && !isInitialSync) {
            console.log('[collaboration] Handling local commit, exporting update');
            try {
              const update = loroDoc!.export({ mode: 'update' });
              console.log('[collaboration] Update exported:', {
                length: update.length,
                bytes: Array.from(update.slice(0, 20)),
              });

              if (update.length > 0) {
                console.log('[collaboration] Sending local update:', update.length, 'bytes');
                socket!.emit('update', {
                  roomId,
                  update: Array.from(update),
                  peerId: socketPeerId,
                });
                console.log('[collaboration] Update sent to server');
              } else {
                console.warn('[collaboration] Update is empty, not sending');
              }
            } catch (error) {
              console.error('[collaboration] Failed to send local update:', error);
            }
          } else if (event.by === 'local') {
            console.log('[collaboration] Local commit detected but not sending:', {
              socketConnected: socket?.connected,
              isRemoteUpdate,
              isInitialSync,
            });
          }
        });

        // Initialize loro with current schema
        const initialSchema = context.getSchema();
        console.log('[collaboration] Initializing Loro with schema:', {
          elementCount: Object.keys(initialSchema.elements).length,
          layoutRoot: initialSchema.layout.root,
        });
        schemaToLoro(initialSchema);
        console.log('[collaboration] Loro initialized');

        // Auto-connect if enabled
        if (autoConnect) {
          console.log('[collaboration] Auto-connecting to server...');
          connect().catch((error) => {
            console.error('[collaborationPlugin] Failed to auto-connect:', error);
          });
        }
      },

      onBeforeInsert() {},

      onAfterInsert(schema: Schema, operation: InsertOperation) {
        console.log('[collaboration] onAfterInsert called:', {
          elementId: operation.elementId,
          type: operation.element.type,
          parentId: operation.parentId,
          index: operation.index,
          isRemoteUpdate,
        });

        if (isRemoteUpdate || !loroDoc) return;

        const elementData: { type: string; props: Record<string, unknown>; hidden?: boolean } =
          {
            type: operation.element.type,
            props: operation.element.props || {},
          };

        if (operation.element.hidden !== undefined) {
          elementData.hidden = operation.element.hidden;
        }

        insertElement(operation.elementId, elementData, operation.parentId, operation.index);
      },

      onBeforeMove() {},

      onAfterMove(schema: Schema, operation: MoveOperation) {
        if (isRemoteUpdate || !loroDoc) return;
        moveElement(
          operation.elementId,
          operation.oldParentId,
          operation.newParentId,
          operation.newIndex,
        );
      },

      onBeforeRemove() {},

      onAfterRemove(schema: Schema, operation: RemoveOperation) {
        if (isRemoteUpdate || !loroDoc) return;
        removeElement(operation.elementId, operation.parentId);
      },

      onBeforeUpdateProps() {},

      onAfterUpdateProps(schema: Schema, operation: UpdatePropsOperation) {
        if (isRemoteUpdate || !loroDoc) return;
        updateElementProps(operation.elementId, operation.props);
      },

      connect,
      disconnect,
      isConnected: () => socket?.connected ?? false,
      getPeers: () => Array.from(peers),
      getRoomId: () => roomId,
      updateElementProps,
      insertElement,
      removeElement,
      moveElement,
    };
  },
);
