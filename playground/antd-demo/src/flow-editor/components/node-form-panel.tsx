import React from 'react';
import { useEditorContext } from '@tangramino/flow-editor';

export const NodeFormPanel = () => {
  const { activeNode } = useEditorContext();

  return (
    <div className='w-54 bg-gray-50 flex p-2 flex-col'>
      {activeNode ? (
        <>
          <div className='h-8 text-slate-800'>{activeNode.title || activeNode.type}</div>
          <div className='flex-1'>
            {activeNode?.renderForm?.({
              id: activeNode.id,
              type: activeNode.type,
              data: activeNode.data,
            })}
          </div>
        </>
      ) : (
        <>
          <div className='h-8 text-slate-800'>节点配置</div>
          <div className='flex-1 flex justify-center items-center text-xs'>
            <span>请选择节点</span>
          </div>
        </>
      )}
    </div>
  );
};
