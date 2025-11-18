import React from 'react';
import { WorkflowDragService, useService } from '@flowgram.ai/free-layout-editor';
import { uniqueId } from '../utils';
import type { FlowNode } from '../interface/node';

export const useDragNode = () => {
  const startDragService = useService<WorkflowDragService>(WorkflowDragService);

  return (e: React.MouseEvent, node: FlowNode) => {
    return startDragService.startDragCard(node.type, e, {
      id: uniqueId(node.type),
      type: node.type,
      data: node.defaultProps,
    });
  };
};
