import React from 'react';
import type { Node } from '../interface/node';

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
