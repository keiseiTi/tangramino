import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const request: FlowNode = {
  type: 'request',
  title: '接口请求',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};