import { create } from 'zustand';
import type { FlowGraphData } from '@tangramino/flow-editor';
import { uniqueId, type Material, type Method } from '@tangramino/core';

export type ActiveElementEvent = {
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
  setFlowGraphData: (flowGraphData) =>
    set(() => ({
      flowGraphData: flowGraphData || {
        nodes: [
          {
            id: 'start_' + uniqueId(undefined, 8),
            type: 'start',
            meta: {
              position: { x: 0, y: 0 },
            },
            data: {},
          },
        ],
        edges: [],
      },
    })),
  activeElementEvent: null,
  setActiveElementEvent: (activeElementEvent: ActiveElementEvent | null) =>
    set(() => ({ activeElementEvent })),
}));
