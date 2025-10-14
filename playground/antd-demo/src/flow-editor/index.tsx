import React from 'react';
import { useEditorCore } from '@tangramino/core';
import { FlowEditor as BaseFlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import { NodePanel } from './mods/node-panel';
import { AttributePanel } from './mods/attribute-panel';
import { nodes } from './nodes';

export interface FlowEditorProps {
  className?: string;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { className } = props;

  const { engine } = useEditorCore();
  const { flowGraphData } = useEditorContext();

  return (
    <div className={className}>
      <BaseFlowEditor nodes={nodes} flowGraphData={flowGraphData} engine={engine}>
        <div className='flex h-full'>
          <NodePanel nodes={nodes} />
          <EditorRenderer className='flex-1 relative' />
          <AttributePanel />
        </div>
      </BaseFlowEditor>
    </div>
  );
};
