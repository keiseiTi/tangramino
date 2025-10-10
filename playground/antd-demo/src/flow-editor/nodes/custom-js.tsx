import React from 'react';
import type { FlowNode } from '@tangramino/flow-editor';

export const customJS: FlowNode = {
  type: 'customJs',
  title: '自定义JS',
  renderNode: () => {
    return (
      <div className='w-24 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
        自定义JS
      </div>
    );
  },
  renderForm: () => {
    return <div>123</div>;
  },
};
