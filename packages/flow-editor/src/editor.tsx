import React from 'react';
import { FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { Wrapper } from './components/wrapper';
import { useEditorProps } from './hooks/use-editor-props';
import { EditorContextProvider } from './context/editor-context';
import type { FlowGraphData, FlowNode } from './interface/node';
import '@flowgram.ai/free-layout-editor/index.css';

export interface FlowEditorProps {
  children?: React.ReactNode;
  nodes?: FlowNode[];
  value?: FlowGraphData;
  onChange?: (flowGraphData: FlowGraphData) => void;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { children, nodes, value, onChange } = props;
  const editorProps = useEditorProps({
    nodes,
    value,
    onChange,
  });

  return (
    <FreeLayoutEditorProvider {...editorProps}>
      <EditorContextProvider nodes={nodes || []}>
        <Wrapper value={value}>{children}</Wrapper>
      </EditorContextProvider>
    </FreeLayoutEditorProvider>
  );
};
