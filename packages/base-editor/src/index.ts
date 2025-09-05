export { EditorProvider, type EditorProviderProps } from './provider';
export { CanvasEditor, type EnhancedComponentProps } from './components/canvas-editor';
export { Placeholder, type DropPlaceholderProps } from './components/placeholder';
export { Draggable } from './components/draggable';
export { DragOverlay } from './components/drag-overlay';
export { useEditorStore, type EditorStore } from './hooks/editor';

export { uniqueId } from './utils';

export type { EditorConfig } from './interface/editor-config';
export type { Material } from './interface/material';
export type { Plugin } from './interface/plugin';
