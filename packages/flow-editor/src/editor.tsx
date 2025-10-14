import React from 'react';
import { FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { Wrapper } from './components/wrapper';
import { useEditorProps } from './hooks/use-editor-props';
import { EditorContextProvider } from './context/editor-context';
import type { Engine } from '@tangramino/engine';
import type { FlowGraphData, FlowNode } from './interface/node';
import '@flowgram.ai/free-layout-editor/index.css';

export interface FlowEditorProps {
  engine?: Engine;
  children?: React.ReactNode;
  nodes?: FlowNode[];
  flowGraphData?: FlowGraphData;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { children, nodes, flowGraphData } = props;
  const editorProps = useEditorProps({
    nodes,
    flowGraphData,
  });

  return (
    <FreeLayoutEditorProvider {...editorProps}>
      <EditorContextProvider nodes={nodes || []}>
        <Wrapper flowGraphData={flowGraphData}>{children}</Wrapper>
      </EditorContextProvider>
    </FreeLayoutEditorProvider>
  );
};
