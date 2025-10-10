import React from 'react';
import type { FlowNode } from './node';

export type ActiveNode = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  title: string | null;
  renderForm: (props: RenderFormProps) => React.ReactNode;
};

export type RenderFormProps = Omit<ActiveNode, 'renderForm'>;

export interface EditorContextValue {
  activeNode: ActiveNode | null;
  nodes: FlowNode[];
  setActiveNode: (node: ActiveNode) => void;
}
