import React, { useMemo } from 'react';
import { generateNodeRegistries } from '../utils';
import { BaseNode } from '../components/base-node';
import type { FreeLayoutProps, Plugin } from '@flowgram.ai/free-layout-editor';
import type { FlowGraphData, FlowNode } from '../interface/node';

export interface UseEditorPropsProps {
  readonly?: boolean;
  value?: FlowGraphData | undefined;
  nodes?: FlowNode[] | undefined;
  onChange?: ((value: FlowGraphData) => void) | undefined;
  canAddLine?: FreeLayoutProps['canAddLine'];
  canDeleteNode?: FreeLayoutProps['canDeleteNode'];
  canDeleteLine?: FreeLayoutProps['canDeleteLine'];
  canResetLine?: FreeLayoutProps['canResetLine'];
  canDropToNode?: FreeLayoutProps['canDropToNode'];
  plugins?: Plugin[];
}

export const useEditorProps = (props: UseEditorPropsProps) => {
  const {
    value,
    nodes,
    readonly,
    onChange,
    canAddLine,
    canDeleteNode,
    canDeleteLine,
    canResetLine,
    canDropToNode,
    plugins,
  } = props;
  return useMemo<FreeLayoutProps>(
    () => ({
      background: true,
      readonly: readonly ?? false,
      initialData: value || { nodes: [], edges: [] },
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
      onContentChange(ctx) {
        const data = ctx.document.toJSON();
        onChange?.(data);
      },
      nodeEngine: {
        enable: true,
      },
      history: {
        enable: true,
        enableChangeNode: true,
      },
      canAddLine(...args) {
        const [, fromPort, toPort] = args;
        if (fromPort.node === toPort.node) {
          return false;
        }
        return canAddLine?.(...args) ?? true;
      },
      canDeleteNode(...args) {
        return canDeleteNode?.(...args) ?? true;
      },
      canDeleteLine(...args) {
        return canDeleteLine?.(...args) ?? true;
      },
      canResetLine(...args) {
        return canResetLine?.(...args) ?? true;
      },
      canDropToNode(...args) {
        return canDropToNode?.(...args) ?? true;
      },

      onInit: () => {},
      onAllLayersRendered(ctx) {
        ctx.tools.fitView(false);
      },
      onDispose() {},
      plugins: () => plugins || [],
    }),
    [],
  );
};
