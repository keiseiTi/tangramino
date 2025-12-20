import React, { useMemo } from 'react';
import { EditorProvider, DragOverlay, useEditorCore, historyPlugin } from '@tangramino/base-editor';
import { materialGroups } from '@/materials/group';
import BasicPage from '@/materials/basic-page/material-config';
import { materialPlugin } from '@/plugins/material';
import { formPlugin } from '@/plugins/form';
import { portalPlugin } from '@/plugins/portal';

import { Operation } from './mods/operation';
import { Sidebar } from './mods/sidebar';
import { MainContent } from './mods/main-content';
import { InsertPositionIndicator } from './mods/insert-position-indicator';
import { defaultSchema } from '../constant';
import type { Schema } from '@tangramino/engine';
import type { Material } from '@/interfaces/material';

const materials = materialGroups.flatMap((group) => group.children).concat(BasicPage);

export interface EditorPageProps {
  schema?: Schema;
}

const getLocalSchema = (): Schema | undefined => {
  try {
    const storedSchema = sessionStorage.getItem('tg_schema');
    return storedSchema ? JSON.parse(storedSchema) : undefined;
  } catch (e) {
    console.error('Failed to parse schema from sessionStorage', e);
    return undefined;
  }
};

const EditorLayout = () => {
  const { dragElement } = useEditorCore();

  let title = '组件';

  if (dragElement) {
    if (dragElement.hasOwnProperty('material')) {
      title = (dragElement as any).material.title;
    } else {
      title = (dragElement as Material).title;
    }
  }

  return (
    <>
      <div className='flex flex-col w-full h-screen min-w-[1080px] bg-gray-50'>
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200'>
          <Operation />
        </div>
        <div className='flex-1 overflow-hidden'>
          <div className='flex h-full w-full'>
            <Sidebar />
            <div className='flex-1 flex min-w-0 relative'>
              <MainContent materialGroups={materialGroups} />
            </div>
          </div>
        </div>
      </div>
      <InsertPositionIndicator />
      <DragOverlay>
        <div className='w-24 p-1 text-xs flex justify-center items-center rounded-sm border border-slate-600 bg-[#fafafabf] cursor-copy'>
          <span className='text-store-600'>{title}</span>
        </div>
      </DragOverlay>
    </>
  );
};

const EditorPage = (props: EditorPageProps) => {
  const { schema } = props;

  const initialSchema = useMemo(() => {
    return schema || getLocalSchema() || defaultSchema;
  }, [schema]);

  const plugins = useMemo(
    () => [historyPlugin(), materialPlugin(), formPlugin(), portalPlugin()],
    [],
  );

  return (
    <EditorProvider materials={materials} schema={initialSchema} plugins={plugins}>
      <EditorLayout />
    </EditorProvider>
  );
};

export default EditorPage;
