import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const setElement: FlowNode = {
  type: 'setElement',
  title: '设置元素属性',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
