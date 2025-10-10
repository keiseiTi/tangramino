import React from 'react';
import { NodeRender } from './node-render';
import type { FlowNode } from '@tangramino/flow-editor';
import { FormConfig } from './form-config';

export const start: FlowNode = {
  type: 'start',
  title: '开始',
  nodeMeta: {
    isStart: true,
    deleteDisable: true,
    copyDisable: true,
    nodePanelVisible: false,
    defaultPorts: [{ type: 'output' }],
  },
  renderNode: NodeRender,
  renderForm: FormConfig,
};
