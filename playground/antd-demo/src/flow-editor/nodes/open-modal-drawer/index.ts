import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

export const openModalDrawer: FlowNode = {
  type: 'openModalDrawer',
  title: '打开弹窗抽屉',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
