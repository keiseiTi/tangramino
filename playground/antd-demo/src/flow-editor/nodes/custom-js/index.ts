import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

export const customJS: FlowNode = {
  type: 'customJS',
  title: '自定义JS',
  renderNode: NodeRender,
  renderForm: FormConfig,
};
