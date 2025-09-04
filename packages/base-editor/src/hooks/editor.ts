import { create } from 'zustand';
import { createEngine, type Engine, type Schema } from '@tangramino/engine';
import type { Material } from '../interface/material';

export type activeElement = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  material: Material;
  parents?: activeElement[];
};

export type InsertPosition = {
  id: string;
  position: 'before' | 'after';
};

export interface EditorStore {
  engine: Engine | null;
  schema: Schema;
  setSchema: (schema: Schema) => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  activeElement: activeElement | null;
  setActiveElement: (activeElement: activeElement | null) => void;
  insertPosition: InsertPosition | null;
  setInsertPosition: (insertPosition: InsertPosition | null) => void;
  dragElement: Material | null;
  setDragElement: (dragElement: Material | null) => void;
}

const defaultSchema = {
  elements: {
    basicPage: {
      type: 'basicPage',
      props: {},
    },
  },
  layout: {
    root: 'basicPage',
    structure: {
      basicPage: [],
    },
  },
  extensions: {},
};

export const useEditorStore = create<EditorStore>((set) => ({
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
