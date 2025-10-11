import React from 'react';
import { useNodeContext } from '@tangramino/flow-editor';

export const NodeRender = () => {
  const nodeContext = useNodeContext();
  const { data } = nodeContext;

  return (
    <div className='w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4'>
      {data?.alias || '开始'}
    </div>
  );
};
