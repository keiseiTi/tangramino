import React, { useMemo } from 'react';
import { generateNodeRegistries } from '../utils';
import { BaseNode } from '../components/base-node';
import type { FreeLayoutProps } from '@flowgram.ai/free-layout-editor';
import type { FlowGraphData, FlowNode } from '../interface/node';

interface UseEditorPropsProps {
  flowGraphData?: FlowGraphData | undefined;
  nodes?: FlowNode[] | undefined;
}

export const useEditorProps = (props: UseEditorPropsProps) => {
  const { flowGraphData, nodes } = props;
  return useMemo<FreeLayoutProps>(
    () => ({
      background: true,
      readonly: false,
      initialData: flowGraphData || { nodes: [], edges: [] },
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
        renderDefaultNode: BaseNode,
      },
      onContentChange(ctx, event) {
        // ctx.setData(data);
        console.log('Auto Save: ', event, {
          ...ctx.document.toJSON(),
        });
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
