import React from 'react';
import type { FlowNode } from '@tangramino/flow-editor';

export const condition: FlowNode = {
  type: 'condition',
  title: '条件判断',
  nodeMeta: {},
  renderNode: () => {
    return (
      <div className='w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
        条件判断
      </div>
    );
  },
};
