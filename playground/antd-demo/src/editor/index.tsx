import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';
import materials from '../materials';
import { Operation } from '../components/operation';
import { MaterialPanel } from '../components/material-panel';

const EditorPage = () => {
  return (
    <EditorProvider materials={materials}>
      <div className='flex flex-col w-full h-full'>
        <Operation />
        <div className='flex flex-1'>
          <MaterialPanel />
          <CanvasEditor className='flex-1' />
          {/* <AttributePanel /> */}
        </div>
      </div>
    </EditorProvider>
  );
};

export default EditorPage;
