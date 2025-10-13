import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

interface ShowElementNodeProps {
  elementId: string;
}

export const showElement: FlowNode<ShowElementNodeProps> = {
  type: 'showElement',
  title: '显示元素',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
