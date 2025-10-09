import React from 'react';
import { WorkflowDragService, useService } from '@flowgram.ai/free-layout-editor';
import type { Node } from '../interface/node';

export const useDragNode = () => {
  const startDragService = useService<WorkflowDragService>(WorkflowDragService);

  return (e: React.MouseEvent, node: Node) => {
    return startDragService.startDragCard(node.type, e, {
      data: node.defaultProps,
    });
  };
};
