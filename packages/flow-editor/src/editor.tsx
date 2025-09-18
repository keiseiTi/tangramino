import React from 'react';
import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';

import { useEditorProps } from './hooks/use-editor-props';
import { Tools } from './components/tools';
import { NodeAddPanel } from './components/node-add-panel';
import '@flowgram.ai/free-layout-editor/index.css';

export const FlowEditor = () => {
  const editorProps = useEditorProps();
  return (
    <div className='w-full h-full'>
      <FreeLayoutEditorProvider {...editorProps}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
            <NodeAddPanel />
            <EditorRenderer
              style={{
                flexGrow: 1,
                position: 'relative',
                height: '100%',
              }}
            />
          </div>
          <Tools />
        </div>
      </FreeLayoutEditorProvider>
    </div>
  );
};
