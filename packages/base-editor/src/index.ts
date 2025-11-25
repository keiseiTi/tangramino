export { EditorProvider, type EditorProviderProps } from './provider';
export { CanvasEditor, type EnhancedComponentProps } from './components/canvas-editor';
export { Placeholder, type DropPlaceholderProps } from './components/placeholder';
export { Draggable } from './components/draggable';
export { DragOverlay } from './components/drag-overlay';
export { useEditorCore, type EditorCore, type ActiveElement } from './hooks/use-editor-core';
export { usePluginCore, usePluginContext, type PluginCore } from './hooks/use-plugin-core';
export { useMove } from './hooks/use-drag-drop';

export { uniqueId } from './utils';
export { validatePluginDependencies, applyPluginsWithValidation } from './utils/plugin-validator';

export { historyPlugin } from './plugins/history';
export { modePlugin } from './plugins/mode';
export { contextValuePlugin } from './plugins/context-value';

export type { EditorConfig, AttributeConfig, PanelConfig } from './interface/editor-config';
export type { Material, MaterialComponentProps } from './interface/material';
export type { Plugin } from './interface/plugin';
export type { Variable, Method, ContextConfig } from './interface/context-config';
