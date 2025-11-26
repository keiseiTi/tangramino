import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

export const emitElementAction: FlowNode = {
  type: 'emitElementAction',
  title: '触发元素方法',
  renderNode: NodeRender,
  renderForm: FormConfig,
};
