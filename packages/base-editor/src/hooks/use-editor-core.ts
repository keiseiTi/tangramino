import { create } from 'zustand';
import { createEngine, type Engine, type Schema } from '@tangramino/engine';
import type { Material } from '../interface/material';

export type ActiveElement = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  material: Material;
  parents?: ActiveElement[];
};

export type InsertPosition = {
  id: string;
  position: 'before' | 'after' | 'up' | 'down';
};

export interface EditorCore {
  engine: Engine;
  schema: Schema;
  setSchema: (schema: Schema) => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  activeElement: ActiveElement | null;
  setActiveElement: (activeElement: ActiveElement | null) => void;
  insertPosition: InsertPosition | null;
  setInsertPosition: (insertPosition: InsertPosition | null) => void;
  dragElement: Material | null;
  setDragElement: (dragElement: Material | null) => void;
}

const defaultSchema = {
  elements: {},
  layout: {
    root: '',
    structure: {},
  },
  extensions: {},
};

export const useEditorCore = create<EditorCore>((set) => ({
  engine: createEngine(defaultSchema),
  schema: defaultSchema,
  setSchema: (schema) => set(() => ({ schema })),
  materials: [],
  setMaterials: (materials) => set(() => ({ materials })),
  activeElement: null,
  setActiveElement: (activeElement) => set(() => ({ activeElement })),
  insertPosition: null,
  setInsertPosition: (insertPosition) => set(() => ({ insertPosition })),
  dragElement: null,
  setDragElement: (dragElement) => set(() => ({ dragElement })),
}));
