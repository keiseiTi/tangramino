import React from 'react';
import { nanoid } from 'nanoid';
import type { FlowNode } from '../interface/node';

export const uniqueId = (prefix?: string) => (prefix ? prefix + '_' + nanoid(8) : nanoid(16));

export const generateNodeRegistries = (nodes: FlowNode[]) =>
  nodes.map((node) => {
    const { type, nodeMeta, renderNode, ...rest } = node;
    return {
      type,
      meta: {
        ...nodeMeta,
      },
      formMeta: {
        render: renderNode ? () => renderNode!() : () => <>{type}</>,
      },
      ...rest,
    };
  });
