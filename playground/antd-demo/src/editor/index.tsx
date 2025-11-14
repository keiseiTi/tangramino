import React from 'react';
import { EditorProvider, DragOverlay, useEditorCore } from '@tangramino/base-editor';
import { materialGroups } from '@/materials/group';
import { materialPlugin } from '@/plugins/material';
import { Operation } from './mods/operation';
import { defaultSchema } from '../constant';
import { Sidebar } from './mods/sidebar';
import { MainContent } from './mods/main-content';
import type { Schema } from '@tangramino/engine';

const materials = materialGroups.flatMap((group) => group.children);

export interface EditorPageProps {
  schema?: Schema;
}

const localSchema = sessionStorage.getItem('tg_schema')
  ? JSON.parse(sessionStorage.getItem('tg_schema')!)
  : undefined;

const EditorPage = (props: EditorPageProps) => {
  const { schema = localSchema } = props;
  const { dragElement } = useEditorCore();

  return (
    <EditorProvider
      materials={materials}
      schema={schema || defaultSchema}
      plugins={[materialPlugin()]}
    >
      <div className='flex flex-col w-full h-screen min-w-[1080px] bg-gray-50'>
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200'>
          <Operation />
        </div>
        <div className='flex-1 overflow-hidden'>
          <div className='flex h-full w-full'>
            <Sidebar />
            <div className='flex-1 flex min-w-0'>
              <MainContent materialGroups={materialGroups} />
            </div>
          </div>
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
