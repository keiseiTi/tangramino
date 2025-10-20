import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

export const visibleElement: FlowNode = {
  type: 'visibleElement',
  title: '显隐元素',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
