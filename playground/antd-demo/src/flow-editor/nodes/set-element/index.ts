import React from 'react';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';
import type { FlowNode } from '@tangramino/flow-editor';

interface SetElementNodeProps {
  elementId: string;
  props: Record<string, unknown>;
}

export const setElement: FlowNode<SetElementNodeProps> = {
  type: 'setElement',
  title: '设置元素属性',
  nodeMeta: {},
  renderNode: NodeRender,
  renderForm: FormConfig,
};
