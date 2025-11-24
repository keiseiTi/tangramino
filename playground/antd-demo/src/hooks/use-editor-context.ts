import { create } from 'zustand';
import type { FlowGraphData } from '@tangramino/flow-editor';
import { uniqueId, type Material, type Method } from '@tangramino/base-editor';

export type ActiveElementEvent = {
  elementId: string;
  material: Material;
  method?: Method;
};

export type LeftPanel = 'view' | 'schema' | 'globals' | 'logic' | 'datasource';

type EditorMode = 'view' | 'logic';
type ViewportDevice = 'PC' | 'PAD' | 'MOBILE';

const initialLeftPanel: LeftPanel =
  (typeof window !== 'undefined'
    ? (sessionStorage.getItem('tg_leftPanel') as LeftPanel | null)
    : null) || 'view';
const initialMode: EditorMode =
  (typeof window !== 'undefined'
    ? (sessionStorage.getItem('tg_mode') as EditorMode | null)
    : null) || 'view';
const initialViewportDevice: ViewportDevice =
  (typeof window !== 'undefined'
    ? (sessionStorage.getItem('tg_viewportDevice') as ViewportDevice | null)
    : null) || 'PC';
const defaultDeviceWidths: Record<ViewportDevice, number> = {
  PC: 1296,
  PAD: 768,
  MOBILE: 375,
};
const initialViewportWidth: number =
  (typeof window !== 'undefined'
    ? Number(sessionStorage.getItem('tg_viewportWidth'))
    : NaN) || defaultDeviceWidths[initialViewportDevice];

export const useEditorContext = create<{
  leftPanel: LeftPanel;
  setLeftPanel: (leftPanel: LeftPanel) => void;
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  viewportDevice: ViewportDevice;
  setViewportDevice: (device: ViewportDevice) => void;
  viewportWidth: number;
  setViewportWidth: (width: number) => void;
  flowGraphData: FlowGraphData;
  setFlowGraphData: (flowGraphData: FlowGraphData) => void;
  activeElementEvent: ActiveElementEvent | null;
  setActiveElementEvent: (activeElementEvent: ActiveElementEvent | null) => void;
}>((set) => ({
  leftPanel: initialLeftPanel,
  setLeftPanel: (leftPanel) =>
    set(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tg_leftPanel', leftPanel);
      }
      return { leftPanel };
    }),
  mode: initialMode,
  setMode: (mode) =>
    set(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tg_mode', mode);
      }
      return { mode };
    }),
  viewportDevice: initialViewportDevice,
  setViewportDevice: (device) =>
    set(() => {
      const nextWidth = defaultDeviceWidths[device];
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tg_viewportDevice', device);
        sessionStorage.setItem('tg_viewportWidth', String(nextWidth));
      }
      return { viewportDevice: device, viewportWidth: nextWidth };
    }),
  viewportWidth: initialViewportWidth,
  setViewportWidth: (width) =>
    set(() => {
      const w = Math.max(240, Math.floor(width || 0));
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tg_viewportWidth', String(w));
      }
      return { viewportWidth: w };
    }),
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
