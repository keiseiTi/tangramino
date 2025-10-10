import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const showElement: FlowNode = {
  type: 'showElement',
  title: '显示元素',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};