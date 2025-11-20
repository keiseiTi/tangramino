import type { Elements, Element, Schema } from './schema';
import type { ContextValue, ContextValues, LayoutTree, State } from './custom-types';
import type { Listener, ListenerMap } from './event';

/**
 * Core engine interface for managing elements, layouts, and state
 * Provides methods for schema manipulation, event handling, and state management
 */
export interface Engine {
  /** Map of all elements in the engine, keyed by element ID */
  elements: Elements;
  /** Layout tree structure defining element hierarchy */
  layouts: LayoutTree;
  /** Custom extensions for storing additional data */
  extensions: Record<string, unknown>;
  /** Callback functions injected into elements */
  injectionCallback: Record<string, ListenerMap>;
  /** Context values shared across the engine */
  contextValues: ContextValues;

  /**
   * Set a context value
   * @param field - The field name
   * @param value - The value to set
   */
  setContextValue: (field: string, value: ContextValue) => void;

  /**
   * Get a context value
   * @param field - The field name
   * @returns The context value or undefined if not found
   */
  getContextValue: (field: string) => ContextValue | undefined;

  /**
   * Update the state (props) of one or more elements
   * @param state - Object mapping element IDs to their new state
   */
  setState: (state: State) => void;

  /**
   * Get the state (props) of an element or all elements
   * @param id - Optional element ID. If omitted, returns all element states
   * @returns Element state or all states
   */
  getState: (id?: string) => State | Record<string, unknown> | null;

  /**
   * Set an extension value
   * @param field - The extension field name
   * @param value - The value to set
   */
  setExtensions: (field: string, value: unknown) => void;

  /**
   * Get an extension value
   * @param field - The extension field name
   * @returns The extension value
   */
  getExtensions: (field: string) => unknown;

  /**
   * Set a global variable accessible throughout the engine
   * @param field - The variable name
   * @param value - The value to set
   */
  setGlobalVariable: (field: string, value: unknown) => void;

  /**
   * Get a global variable value
   * @param field - The variable name
   * @returns The variable value or undefined if not found
   */
  getGlobalVariable: (field: string) => unknown | undefined;

  /**
   * Show (unhide) one or more elements
   * @param ids - Array of element IDs to show
   */
  showElements: (ids: string[]) => void;

  /**
   * Hide one or more elements
   * @param ids - Array of element IDs to hide
   */
  hiddenElements: (ids: string[]) => void;

  /**
   * Inject a callback function into an element
   * @param id - The element ID
   * @param name - The callback name
   * @param callback - The callback function
   */
  injectCallback: (id: string, name: string, callback: Listener) => void;

  /**
   * Register an event listener
   * @param namespace - The event namespace
   * @param eventName - The event name
   * @param callback - The callback function
   */
  on: (namespace: string, eventName: string, callback: Listener) => void;

  /**
   * Unregister an event listener
   * @param namespace - The event namespace
   * @param eventName - The event name
   * @param callback - The callback function to remove
   */
  off: (namespace: string, eventName: string, callback: Listener) => void;

  /**
   * Register a one-time event listener
   * @param namespace - The event namespace
   * @param eventName - The event name
   * @param callback - The callback function
   */
  once: (namespace: string, eventName: string, callback: Listener) => void;

  /**
   * Emit an event
   * @param event - The event namespace
   * @param eventName - The event name
   * @param args - Additional arguments to pass to listeners
   */
  emit: (event: string, eventName: string, ...args: unknown[]) => void;

  /**
   * Remove all listeners for a specific event
   * @param namespace - The event namespace
   * @param eventName - The event name
   */
  offAll: (namespace: string, eventName: string) => void;

  /**
   * Subscribe to an event with automatic cleanup
   * @param name - The event name
   * @param callback - The callback function
   * @returns Unsubscribe function
   */
  subscribe: (name: string, callback: Listener) => () => void;

  /**
   * Change the entire schema
   * Validates and applies a new schema to the engine
   * @param schema - The new schema to apply
   */
  changeSchema: (schema: Schema) => void;

  /**
   * Get the current schema
   * @returns The current schema
   */
  getSchema: () => Schema;

  /**
   * Get all elements as an array
   * @returns Array of elements with their IDs, types, and props
   */
  getElements: () => Element[];
}
