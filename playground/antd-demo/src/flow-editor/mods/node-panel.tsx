import React from 'react';
import { useClientContext, useDragNode, type FlowNode } from '@tangramino/flow-editor';
import { message } from 'antd';

interface NodePanelProps {
  nodes: FlowNode[];
}

export const NodePanel = (props: NodePanelProps) => {
  const { nodes } = props;
  const dragNode = useDragNode();

  const client = useClientContext();

  const insertNode = (e: React.MouseEvent, node: FlowNode) => {
    if (!client.document.toJSON().nodes.find((n) => n.type === 'start')) {
      message.info('画布无开始节点，无法添加其他节点，请先选择元素');
      return;
    }
    dragNode(e, node);
  };

  return (
    <div className='p-3 flex-1 overflow-auto h-full text-xs select-none'>
      {nodes
        .filter((node) => node.type !== 'start')
        .map((node) => (
          <div
            key={node.type}
            className='w-[207px] p-2 mb-2 rounded-sm border border-slate-300 cursor-pointer hover:bg-zinc-100'
            onMouseDown={(e) => {
              insertNode(e, node);
            }}
          >
            {node.title}
          </div>
        ))}
    </div>
  );
};
