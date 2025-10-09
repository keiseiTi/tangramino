import React, { useMemo } from 'react';
import {
  FreeLayoutProps,
  WorkflowNodeRenderer,
  useNodeRender,
  type WorkflowNodeProps,
} from '@flowgram.ai/free-layout-editor';
import { generateNodeRegistries } from '../utils';
import type { FlowSchema, Node } from '../interface/node';

interface UseEditorPropsProps {
  flowSchema?: FlowSchema | undefined;
  nodes?: Node[] | undefined;
}

export const useEditorProps = (props: UseEditorPropsProps) => {
  const { flowSchema, nodes } = props;
  return useMemo<FreeLayoutProps>(
    () => ({
      background: true,
      readonly: false,
      initialData: flowSchema || { nodes: [], edges: [] },
      nodeRegistries: generateNodeRegistries(nodes || []),
      fromNodeJSON(node, json) {
        return json;
      },
      toNodeJSON(node, json) {
        return json;
      },
      getNodeDefaultRegistry(type) {
        return {
          type,
          meta: {
            defaultExpanded: true,
          },
          formMeta: {
            render: () => <>{type}</>,
          },
        };
      },
      materials: {
        renderDefaultNode: (props: WorkflowNodeProps) => {
          const { form } = useNodeRender();
          return <WorkflowNodeRenderer node={props.node}>{form?.render()}</WorkflowNodeRenderer>;
        },
      },
      onContentChange() {
      },
      nodeEngine: {
        enable: true,
      },
      history: {
        enable: true,
        enableChangeNode: true,
      },
      onInit: () => {},
      onAllLayersRendered(ctx) {
        ctx.tools.fitView(false);
      },
      onDispose() {},
      plugins: () => [],
    }),
    [],
  );
};
