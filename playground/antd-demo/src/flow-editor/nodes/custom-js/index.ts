import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const customJS: FlowNode = {
  type: 'customJs',
  title: '自定义JS',
  renderNode: NodeRender,
  renderForm: FormConfig,
};
