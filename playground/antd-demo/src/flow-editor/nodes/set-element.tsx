import React from 'react';
import type { FlowNode } from '@tangramino/flow-editor';

export const setElement: FlowNode = {
  type: 'setElement',
  title: '设置元素属性',
  nodeMeta: {},
  renderNode: () => {
    return (
      <div className='w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
        设置元素属性
      </div>
    );
  },
};
