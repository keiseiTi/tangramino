import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

export const setElementProps: FlowNode = {
  type: 'setElementProps',
  title: '设置元素属性',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
