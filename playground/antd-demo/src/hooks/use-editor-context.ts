import { create } from 'zustand';
import type { FlowGraphData } from '@tangramino/flow-editor';
import { uniqueId, type Material, type Method } from '@tangramino/core';

export type ActiveElementEvent = {
  elementId: string;
  material: Material;
  method?: Method;
};

type LeftPanel = 'view' | 'schema' | 'globals' | 'logic';

type EditorMode = 'view' | 'logic';

export const useEditorContext = create<{
  leftPanel: LeftPanel;
  setLeftPanel: (leftPanel: LeftPanel) => void;
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  flowGraphData: FlowGraphData;
  setFlowGraphData: (flowGraphData: FlowGraphData) => void;
  activeElementEvent: ActiveElementEvent | null;
  setActiveElementEvent: (activeElementEvent: ActiveElementEvent | null) => void;
}>((set) => ({
  leftPanel: 'view',
  setLeftPanel: (leftPanel) => set(() => ({ leftPanel })),
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
