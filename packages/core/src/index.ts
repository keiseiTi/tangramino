export { EditorProvider, type EditorProviderProps } from './provider';
export { CanvasEditor, type EnhancedComponentProps } from './components/canvas-editor';
export { Placeholder, type DropPlaceholderProps } from './components/placeholder';
export { Draggable } from './components/draggable';
export { DragOverlay } from './components/drag-overlay';
export { useEditorCore, type EditorCore, type ActiveElement } from './hooks/use-editor-core';
export { usePluginStore, usePluginContext, type PluginStore } from './hooks/use-plugin';
export { useMove } from './hooks/use-drag-drop';

export { uniqueId } from './utils';

export type { EditorConfig, AttributeConfig, PanelConfig } from './interface/editor-config';
export type { Material } from './interface/material';
export type { Plugin } from './interface/plugin';
