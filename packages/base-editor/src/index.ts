export { EditorProvider, type EditorProviderProps } from './provider';
export { CanvasEditor, type EnhancedComponentProps } from './components/canvas-editor';
export { Placeholder, type DropPlaceholderProps } from './components/placeholder';
export { Draggable } from './components/draggable';
export { DragOverlay } from './components/drag-overlay';
export { useEditorStore, type EditorStore, type ActiveElement } from './hooks/editor';
export { usePluginStore, usePluginContext, type PluginStore } from './hooks/plugin';

export { uniqueId } from './utils';

export type {
  EditorConfig,
  TextAttributeConfig,
  InputAttributeConfig,
  NumberAttributeConfig,
  RadioAttributeConfig,
  CheckboxAttributeConfig,
  SelectAttributeConfig,
  SwitchAttributeConfig,
  CustomAttributeConfig,
} from './interface/editor-config';
export type { Material } from './interface/material';
export type { Plugin } from './interface/plugin';
