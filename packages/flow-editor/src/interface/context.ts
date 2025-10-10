import React from 'react';
import type { FlowNode } from './node';

export type ActiveNode = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  title: string | null;
  renderForm: () => React.ReactNode;
};

export interface EditorContextValue {
  activeNode: ActiveNode | null;
  nodes: FlowNode[];
  setActiveNode: (node: ActiveNode) => void;
}
