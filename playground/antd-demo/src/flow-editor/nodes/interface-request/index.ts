import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

export const interfaceRequest: FlowNode = {
  type: 'interfaceRequest',
  title: '接口请求',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
  defaultProps: {},
};
