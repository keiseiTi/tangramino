import { create } from 'zustand';
import { defaultSchema } from '../constant';
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
  activeElement: activeElement | null;
  setActiveElement: (activeElement: activeElement | null) => void;
  engine: Engine | null;
  schema: Schema;
  setSchema: (schema: Schema) => void;
  insertPosition: InsertPosition | null;
  setInsertPosition: (insertPosition: InsertPosition | null) => void;
  dragElement: Material | null;
  setDragElement: (dragElement: Material | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeElement: null,
  setActiveElement: (activeElement) => set(() => ({ activeElement })),
  engine: createEngine(defaultSchema),
  schema: defaultSchema,
  setSchema: (schema) => set(() => ({ schema })),
  insertPosition: null,
  setInsertPosition: (insertPosition) => set(() => ({ insertPosition })),
  dragElement: null,
  setDragElement: (dragElement) => set(() => ({ dragElement })),
}));
