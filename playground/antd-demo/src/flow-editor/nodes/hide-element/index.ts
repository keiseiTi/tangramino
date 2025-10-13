import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

interface HideElementNodeProps {
  elementId: string;
}

export const hideElement: FlowNode<HideElementNodeProps> = {
  type: 'hideElement',
  title: '隐藏元素',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
