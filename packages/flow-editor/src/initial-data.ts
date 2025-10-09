import type { WorkflowJSON } from '@flowgram.ai/free-layout-editor';

export const initialData: WorkflowJSON = {
  nodes: [
    {
      id: 'start_0',
      type: 'start',
      meta: {
        position: { x: 0, y: 0 },
      },
      data: {
        title: 'Start',
        content: 'Start content',
      },
    },
    {
      id: 'node_0',
      type: 'custom-js',
      meta: {
        position: { x: 400, y: 0 },
      },
      data: {
        title: 'Custom',
        content: 'Custom node content',
      },
    },
  ],
  edges: [
    {
      sourceNodeID: 'start_0',
      targetNodeID: 'node_0',
    },
  ],
};
