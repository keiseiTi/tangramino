import type { FlowSchema } from '@tangramino/flow-editor';

export const initialData: FlowSchema = {
  nodes: [
    {
      id: 'start_0',
      type: 'start',
      meta: {
        position: { x: 0, y: 0 },
      },
      data: {},
    },
    {
      id: 'node_0',
      type: 'customJs',
      meta: {
        position: { x: 400, y: 0 },
      },
      data: {},
    },
  ],
  edges: [
    {
      sourceNodeID: 'start_0',
      targetNodeID: 'node_0',
    },
  ],
};
