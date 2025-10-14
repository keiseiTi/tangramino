import { create } from 'zustand';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useEditorContext = create<{
  mode: 'view' | 'logic';
  setMode: (mode: 'view' | 'logic') => void;
  flowGraphData: FlowGraphData;
  setFlowGraphData: (flowGraphData: FlowGraphData) => void;
}>((set) => ({
  mode: 'view',
  setMode: (mode) => set(() => ({ mode })),
  flowGraphData: {
    nodes: [],
    edges: [],
  },
  setFlowGraphData: (flowGraphData) => set(() => ({ flowGraphData })),
}));
