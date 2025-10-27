import React from 'react';
import { FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { Wrapper } from './components/wrapper';
import { useEditorProps, type UseEditorPropsProps } from './hooks/use-editor-props';
import { EditorContextProvider } from './context/editor-context';
import '@flowgram.ai/free-layout-editor/index.css';

export interface FlowEditorProps extends UseEditorPropsProps {
  children?: React.ReactNode;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { children, nodes, value, onChange, ...rest } = props;
  const editorProps = useEditorProps({
    nodes,
    value,
    onChange,
    ...rest,
  });

  return (
    <FreeLayoutEditorProvider {...editorProps}>
      <EditorContextProvider nodes={nodes || []}>
        <Wrapper value={value}>{children}</Wrapper>
      </EditorContextProvider>
    </FreeLayoutEditorProvider>
  );
};
