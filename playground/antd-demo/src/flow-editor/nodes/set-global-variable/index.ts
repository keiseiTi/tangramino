import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const setGlobalVariable: FlowNode = {
  type: 'setGlobalVariable',
  title: '设置全局变量',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
