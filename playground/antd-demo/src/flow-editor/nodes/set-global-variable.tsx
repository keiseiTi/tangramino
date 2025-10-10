import React from 'react';
import type { FlowNode } from '@tangramino/flow-editor';

export const setGlobalVariable: FlowNode = {
  type: 'setGlobalVariable',
  title: '设置全局变量',
  nodeMeta: {},
  renderNode: () => {
    return (
      <div className='w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
        设置全局变量
      </div>
    );
  },
};
