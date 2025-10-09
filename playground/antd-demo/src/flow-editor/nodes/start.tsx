import React from 'react';
import type { Node } from '@tangramino/flow-editor';

export const start: Node = {
  type: 'start',
  title: '开始',
  nodeMeta: {
    isStart: true,
    deleteDisable: true,
    copyDisable: true,
    nodePanelVisible: false,
    defaultPorts: [{ type: 'output' }],
  },
  renderNode: () => {
    return (
      <div className='w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
        开始
      </div>
    );
  },
};
