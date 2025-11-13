import type { Elements, Element, Schema } from './schema';
import type { ContextValue, ContextValues, LayoutTree, State } from './custom-types';
import type { Listener, ListenerMap } from './event';

export interface Engine {
  elements: Elements;
  layouts: LayoutTree;
  extensions: Record<string, unknown>;
  injectionCallback: Record<string, ListenerMap>;
  contextValues: ContextValues;
  setContextValue: (field: string, value: ContextValue) => void;
  getContextValue: (field: string) => ContextValue | undefined;
  setState: (state: State) => void;
  getState: (id?: string) => State | Record<string, unknown> | null;
  setExtensions: (field: string, value: unknown) => void;
  getExtensions: (field: string) => unknown;
  setGlobalVariable: (field: string, value: unknown) => void;
  getGlobalVariable: (field: string) => unknown | undefined;
  showElements: (ids: string[]) => void;
  hiddenElements: (ids: string[]) => void;
  injectCallback: (id: string, name: string, callback: Listener) => void;
  on: (namespace: string, eventName: string, callback: Listener) => void;
  off: (namespace: string, eventName: string, callback: Listener) => void;
  once: (namespace: string, eventName: string, callback: Listener) => void;
  emit: (event: string, eventName: string, ...args: unknown[]) => void;
  offAll: (namespace: string, eventName: string) => void;
  subscribe: (name: string, callback: Listener) => () => void;
  changeSchema: (schema: Schema) => void;
  getSchema: () => Schema;
  getElements: () => Element[];
}
