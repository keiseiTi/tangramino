import React from 'react';
import type { FlowNode } from './node';

export type ActiveNode = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  title: string | null;
  renderForm: (props: Pick<ActiveNode, 'id' | 'type' | 'data'>) => React.ReactNode;
};

export interface EditorContextValue {
  activeNode: ActiveNode | null;
  nodes: FlowNode[];
  setActiveNode: (node: ActiveNode) => void;
}
