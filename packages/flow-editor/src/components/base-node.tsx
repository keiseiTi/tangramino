import React from 'react';
import {
  useNodeRender,
  WorkflowNodeRenderer,
  type WorkflowNodeProps,
} from '@flowgram.ai/free-layout-editor';
import { useEditorContext } from '../context/editor-context';

export const BaseNode = (props: WorkflowNodeProps) => {
  const { node } = props;
  const { id, type, data, form } = useNodeRender();
  const { setActiveNode } = useEditorContext();

  const nodeRegistry = node.getNodeRegistry();

  const onSelectedNode = () => {
    setActiveNode({
      id,
      title: nodeRegistry.title,
      type: type as string,
      props: data,
      renderForm: nodeRegistry.renderForm,
    });
  };

  return (
    <WorkflowNodeRenderer node={node}>
      <div onClick={onSelectedNode}>{form?.render()}</div>
    </WorkflowNodeRenderer>
  );
};
