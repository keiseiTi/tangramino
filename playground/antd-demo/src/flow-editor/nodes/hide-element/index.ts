import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const hideElement: FlowNode = {
  type: 'hideElement',
  title: '隐藏元素',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};