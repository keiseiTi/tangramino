import React from 'react';
import { FlowEditor as BaseFlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import { NodePanel } from './node-panel';
import { nodes } from './nodes';
import { initialData } from './initial-data';
import type { Engine } from '@tangramino/engine';

export interface FlowEditorProps {
  className?: string;
  engine?: Engine;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { className, engine } = props;

  return (
    <div className={className}>
      <BaseFlowEditor nodes={nodes} flowSchema={initialData} engine={engine}>
        <div className='flex h-full'>
          <NodePanel nodes={nodes} />
          <EditorRenderer className='flex-1 relative' />
        </div>
      </BaseFlowEditor>
    </div>
  );
};
