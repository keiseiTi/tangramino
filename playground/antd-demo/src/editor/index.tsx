import React from 'react';
import {
  EditorProvider,
  CanvasEditor,
  DragOverlay,
  useEditorCore,
  materialPlugin,
} from '@tangramino/core';
import { cn } from '@/utils';
import { materialGroups } from '@/materials/group';
import { FlowEditor } from '@/flow-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import { Operation } from './mods/operation';
import { MaterialPanel } from './mods/material-panel';
import { defaultSchema } from '../constant';
import { AttributePanel } from './mods/attribute-panel';
import { CustomDropPlaceholder } from './mods/drop-placeholder';
import { EnhancedComponent } from './mods/enhanced-comp';
import type { Schema } from '@tangramino/engine';

const materials = materialGroups.flatMap((group) => group.children);

export interface EditorPageProps {
  schema?: Schema;
}

const localSchema = sessionStorage.getItem('schema')
  ? JSON.parse(sessionStorage.getItem('schema')!)
  : undefined;

const EditorPage = (props: EditorPageProps) => {
  const { schema = localSchema } = props;
  const { dragElement } = useEditorCore();
  const { mode } = useEditorContext();

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
        <div
          className={cn('flex-1 overflow-hidden', {
            flex: mode === 'view',
            hidden: mode !== 'view',
          })}
        >
          <MaterialPanel materialGroups={materialGroups} />
          <div className='flex-1 p-4 overflow-auto'>
            <div className='h-full border border-gray-200 bg-white shadow-sm'>
              <CanvasEditor
                className='size-full'
                renderComponent={EnhancedComponent}
                renderDropPlaceholder={CustomDropPlaceholder}
              />
            </div>
          </div>
          <AttributePanel />
        </div>
        {mode === 'logic' && (
          <div className={cn('flex-1 overflow-hidden')}>
            <FlowEditor className='w-full h-screen' />
          </div>
        )}
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
