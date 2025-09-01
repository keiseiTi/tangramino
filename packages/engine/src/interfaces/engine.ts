import type { Elements, Schema } from './schema';
import type { LayoutTree, State } from './custom-types';
import type { Listener, ListenerMap } from './event';

export interface Engine {
  elements: Elements;
  layouts: LayoutTree;
  extensions: Record<string, unknown>;
  injectionCallback: Record<string, ListenerMap>;
  setState: (state: State) => void;
  getState: (id?: string) => State | Record<string, unknown> | null;
  setExtensions: (field: string, value: unknown) => void;
  getExtensions: (field: string) => unknown;
  showElements: (ids: string[]) => void;
  hideElements: (ids: string[]) => void;
  injectCallback: (id: string, name: string, callback: Listener) => void;
  on: (namespace: string, eventName: string, callback: Listener) => void;
  off: (namespace: string, eventName: string, callback: Listener) => void;
  once: (namespace: string, eventName: string, callback: Listener) => void;
  emit: (event: string, eventName: string, ...args: unknown[]) => void;
  offAll: (namespace: string, eventName: string) => void;
  subscribe: (name: string, callback: Listener) => () => void;
  changeSchema: (schema: Schema) => void;
  getSchema: () => Schema;
}
