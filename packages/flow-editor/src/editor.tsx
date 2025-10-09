import React from 'react';
import { FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { useEditorProps } from './hooks/use-editor-props';
import type { Engine } from '@tangramino/engine';
import type { FlowSchema, Node } from './interface/node';
import '@flowgram.ai/free-layout-editor/index.css';

export interface FlowEditorProps {
  engine?: Engine;
  children?: React.ReactNode;
  nodes?: Node[];
  flowSchema?: FlowSchema;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { children, nodes, flowSchema } = props;
  const editorProps = useEditorProps({
    nodes,
    flowSchema,
  });
  return <FreeLayoutEditorProvider {...editorProps}>{children}</FreeLayoutEditorProvider>;
};
