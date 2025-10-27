import React, { useEffect } from 'react';
import {
  useNodeRender,
  WorkflowNodeRenderer,
  type WorkflowNodeProps,
} from '@flowgram.ai/free-layout-editor';
import { useEditorContext } from '../context/editor-context';

export const BaseNode = (props: WorkflowNodeProps) => {
  const { node } = props;
  const { id, type, data, form, updateData, selected } = useNodeRender();
  const { setActiveNode } = useEditorContext();

  const nodeRegistry = node.getNodeRegistry();

  useEffect(() => {
    if (selected) {
      setActiveNode({
        id,
        data,
        type: type as string,
        title: nodeRegistry.title,
        renderForm: nodeRegistry.renderForm,
        updateData,
      });
    }
  }, [selected]);

  return <WorkflowNodeRenderer node={node}>{form?.render()}</WorkflowNodeRenderer>;
};
