import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

interface RequestNodeProps {
  url: string;
  method: string;
  headers: Record<string, string>;
}

export const request: FlowNode = {
  type: 'request',
  title: '接口请求',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
