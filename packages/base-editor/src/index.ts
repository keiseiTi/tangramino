export { EditorProvider, type EditorProviderProps } from './provider';
export { CanvasEditor, type EnhancedComponentProps } from './components/canvas-editor';
export { Placeholder, type DropPlaceholderProps } from './components/placeholder';
export { Draggable } from './components/draggable';
export { Movable } from './components/movable';
export { DragOverlay } from './components/drag-overlay';
export {
  useEditorCore,
  type EditorCore,
  type ActiveElement,
  type DragElement,
} from './hooks/use-editor-core';
export { usePluginCore, usePluginContext, type PluginCore } from './hooks/use-plugin-core';

export { uniqueId } from './utils';
export { validatePluginDependencies } from './utils/plugin-validator';
export { definePlugin, type EditorPluginFactory } from './utils/define-plugin';

export { PluginManager } from './plugins/plugin-manager';

export { historyPlugin } from './plugins/history';
export { modePlugin } from './plugins/mode';
export { contextValuePlugin } from './plugins/context-value';
export {
  collaborationPlugin,
  type CollaborationPlugin,
  type CollaborationOptions,
  type CollaborationPluginExtension,
} from './plugins/collaboration';

export type { EditorConfig, AttributeConfig, PanelConfig } from './interface/editor-config';
export type { Material, MaterialComponentProps } from './interface/material';
export type {
  EditorPlugin,
  PluginContext,
  PluginMeta,
  PluginLifecycle,
  MaterialHooks,
  SchemaHooks,
  EditorHooks,
} from './interface/plugin';
export type { Variable, Method, ContextConfig } from './interface/context-config';
