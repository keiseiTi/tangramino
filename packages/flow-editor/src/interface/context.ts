import React from 'react';
import type { FlowNode } from './node';

export type ActiveNode = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  title: string | null;
  renderForm: (props: RenderFormProps) => React.ReactNode;
  updateData: (data: Record<string, unknown>) => void;
};

export type RenderFormProps = Omit<ActiveNode, 'renderForm'>;

export interface EditorContextValue {
  nodes: FlowNode[];
  activeNode: ActiveNode | null;
  setActiveNode: (node: ActiveNode) => void;
}
