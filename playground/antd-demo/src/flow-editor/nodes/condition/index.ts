import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const condition: FlowNode = {
  type: 'condition',
  title: '条件判断',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};