import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

interface CustomJSNodeProps {
  code: string;
}

export const customJS: FlowNode<CustomJSNodeProps> = {
  type: 'customJs',
  title: '自定义JS',
  renderNode: NodeRender,
  renderForm: FormConfig,
};
