import React from 'react';
import type { FlowNode } from '@tangramino/flow-editor';

export const hideElement: FlowNode = {
  type: 'hideElement',
  title: '隐藏元素',
  nodeMeta: {},
  renderNode: () => {
    return (
      <div className='w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
        隐藏元素
      </div>
    );
  },
};
