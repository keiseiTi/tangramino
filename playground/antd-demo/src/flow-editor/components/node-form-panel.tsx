import React from 'react';
import { useEditorContext } from '@tangramino/flow-editor';

export const NodeFormPanel = () => {
  const { activeNode } = useEditorContext();

  if (activeNode) {
    return (
      <div className='w-60 bg-gray-50 flex flex-col'>
        <div className='p-2 text-slate-800 border-b border-slate-300'>
          {activeNode.title || activeNode.type}
        </div>
        <div className='flex-1 p-2'>{activeNode?.renderForm?.(activeNode)}</div>
      </div>
    );
  }

  return (
    <div className='w-60 bg-gray-50 flex flex-col'>
      <div className='p-2 text-slate-800'>节点配置</div>
      <div className='flex-1 flex justify-center items-center text-xs'>
        <span>请选择节点</span>
      </div>
    </div>
  );
};
