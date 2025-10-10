import React from 'react';
import { useDragNode, type FlowNode } from '@tangramino/flow-editor';

interface NodePanelProps {
  nodes: FlowNode[];
}

export const NodePanel = (props: NodePanelProps) => {
  const { nodes } = props;
  const dragNode = useDragNode();

  return (
    <div className='w-48 bg-gray-50 flex p-2 flex-col'>
      <div className='h-8 text-slate-800'>节点选择</div>
      <div className='flex-1 overflow-auto h-full text-xs'>
        {nodes
          .filter((node) => node.type !== 'start')
          .map((node) => (
            <div
              key={node.type}
              className='w-44 p-2 mb-2 bg-slate-100 cursor-pointer'
              onMouseDown={(e) => {
                dragNode(e, node);
              }}
            >
              {node.title}
            </div>
          ))}
      </div>
    </div>
  );
};
