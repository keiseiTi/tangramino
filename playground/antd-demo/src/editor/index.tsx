import React, { useMemo } from 'react';
import { EditorProvider, CanvasEditor, DragOverlay, useEditorStore } from '@tangramino/base-editor';
import materials from '../materials';
import { Operation } from '../components/operation';
import { MaterialPanel } from '../components/material-panel';
import { defaultSchema } from '../constant';
import { AttributePanel } from '../components/attribute-panel';
import { CustomDropPlaceholder } from '../components/drop-placeholder';
import BasicPageMaterial from '../components/basic-page';
import { EnhancedComponent } from '../components/enhanced-comp';
import type { Schema } from '@tangramino/engine';

export interface EditorPageProps {
  schema?: Schema;
}

const localSchema = sessionStorage.getItem('schema')
  ? JSON.parse(sessionStorage.getItem('schema')!)
  : undefined;
const EditorPage = (props: EditorPageProps) => {
  const { schema = localSchema } = props;

  const { dragElement } = useEditorStore();

  const materialsWithBasicPage = useMemo(() => {
    return [BasicPageMaterial, ...(materials || [])];
  }, []);

  return (
    <EditorProvider materials={materialsWithBasicPage} schema={schema || defaultSchema}>
      <div className='flex flex-col w-full h-screen'>
        <Operation />
        <div className='flex flex-1'>
          <MaterialPanel />
          <CanvasEditor
            className='flex-1 p-4 bg-gray-50'
            renderComponent={EnhancedComponent}
            renderDropPlaceholder={CustomDropPlaceholder}
          />
          <AttributePanel />
        </div>
      </div>
      <DragOverlay>
        <div className='w-24 p-1 text-xs flex justify-center items-center rounded-sm border border-slate-600 bg-[#fafafabf] cursor-copy'>
          <span className='text-store-600'>{dragElement?.title}</span>
        </div>
      </DragOverlay>
    </EditorProvider>
  );
};

export default EditorPage;
