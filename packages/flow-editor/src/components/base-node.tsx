import React from 'react';
import {
  useNodeRender,
  WorkflowNodeRenderer,
  type WorkflowNodeProps,
} from '@flowgram.ai/free-layout-editor';
import { useEditorContext } from '../context/editor-context';

export const BaseNode = (props: WorkflowNodeProps) => {
  const { node } = props;
  const { id, type, data, form, updateData } = useNodeRender();
  const { setActiveNode } = useEditorContext();

  const nodeRegistry = node.getNodeRegistry();

  const onSelectedNode = () => {
    setActiveNode({
      id,
      data,
      type: type as string,
      title: nodeRegistry.title,
      renderForm: nodeRegistry.renderForm,
      updateData,
    });
  };

  return (
    <WorkflowNodeRenderer node={node}>
      <div onClick={onSelectedNode}>{form?.render()}</div>
    </WorkflowNodeRenderer>
  );
};
