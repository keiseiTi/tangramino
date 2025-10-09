import React from 'react';
import { nanoid } from 'nanoid';
import type { Node } from '../interface/node';

export const uniqueId = (prefix?: string) => (prefix ? prefix + '_' + nanoid(8) : nanoid(16));

export const generateNodeRegistries = (nodes: Node[]) => {
  return nodes.map((node) => {
    return {
      type: node.type,
      meta: {},
      formMeta: {
        render: node.renderNode ? () => node.renderNode!() : () => <>{node.type}</>,
      },
    };
  });
};
