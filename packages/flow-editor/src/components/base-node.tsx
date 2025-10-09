import React from 'react';
import {
  useNodeRender,
  WorkflowNodeRenderer,
  type WorkflowNodeProps,
} from '@flowgram.ai/free-layout-editor';

export const BaseNode = (props: WorkflowNodeProps) => {
  const { form } = useNodeRender();

  const onSelectedNode = () => {
  };

  return (
    <WorkflowNodeRenderer className='demo-free-node' node={props.node}>
      <div onClick={onSelectedNode}>{form?.render()}</div>
    </WorkflowNodeRenderer>
  );
};
