import React from 'react';
import { FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { useEditorProps } from './hooks/use-editor-props';
import { EditorContextProvider } from './context/editor-context';
import type { Engine } from '@tangramino/engine';
import type { FlowSchema, FlowNode } from './interface/node';
import '@flowgram.ai/free-layout-editor/index.css';

export interface FlowEditorProps {
  engine?: Engine;
  children?: React.ReactNode;
  nodes?: FlowNode[];
  flowSchema?: FlowSchema;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { children, nodes, flowSchema } = props;
  const editorProps = useEditorProps({
    nodes,
    flowSchema,
  });
  return (
    <FreeLayoutEditorProvider {...editorProps}>
      <EditorContextProvider nodes={nodes || []}>{children}</EditorContextProvider>
    </FreeLayoutEditorProvider>
  );
};
