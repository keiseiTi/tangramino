import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

interface ConditionNodeProps {
  condition: string;
}

export const condition: FlowNode<ConditionNodeProps> = {
  type: 'condition',
  title: '条件判断',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
