import { create } from 'zustand';
import type { FlowGraphData } from '@tangramino/flow-editor';
import type { Material, Method } from '@tangramino/core';

type ActiveElementEvent = {
  elementId: string;
  material: Material;
  method?: Method;
};

export const useEditorContext = create<{
  mode: 'view' | 'logic';
  setMode: (mode: 'view' | 'logic') => void;
  flowGraphData: FlowGraphData;
  setFlowGraphData: (flowGraphData: FlowGraphData) => void;
  activeElementEvent: ActiveElementEvent | null;
  setActiveElementEvent: (activeElementEvent: ActiveElementEvent | null) => void;
}>((set) => ({
  mode: 'view',
  setMode: (mode) => set(() => ({ mode })),
  flowGraphData: {
    nodes: [],
    edges: [],
  },
  setFlowGraphData: (flowGraphData) => set(() => ({ flowGraphData })),
  activeElementEvent: null,
  setActiveElementEvent: (activeElementEvent: ActiveElementEvent | null) =>
    set(() => ({ activeElementEvent })),
}));
