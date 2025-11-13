import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import {
  AppstoreOutlined,
  CodeOutlined,
  DatabaseOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { SchemaEditor } from './mods/schema-editor';
import { GlobalVariablesPanel } from './mods/global-variables';

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
  const { mode, setMode } = useEditorContext();
  const [leftPanel, setLeftPanel] = useState<'view' | 'schema' | 'globals' | 'logic'>('view');

  const sidebarItems = useMemo(
    () => [
      { key: 'view' as const, label: '搭建器', icon: <AppstoreOutlined /> },
      { key: 'logic' as const, label: '逻辑编辑', icon: <BranchesOutlined /> },
      { key: 'schema' as const, label: 'Schema', icon: <CodeOutlined /> },
      { key: 'globals' as const, label: '全局变量', icon: <DatabaseOutlined /> },
    ],
    [],
  );

  useEffect(() => {
    setLeftPanel(mode);
  }, [mode]);

  useEffect(() => {
    if (leftPanel === 'logic' || leftPanel === 'view') {
      setMode(leftPanel);
    }
  }, [leftPanel]);

  const renderMainContent = useCallback(() => {
    if (leftPanel === 'schema') {
      return (
        <div className='flex-1 p-4 overflow-auto min-w-0'>
          <div className='h-full border border-gray-200 bg-white shadow-sm'>
            <SchemaEditor />
          </div>
        </div>
      );
    }
    if (leftPanel === 'globals') {
      return (
        <div className='flex-1 p-4 overflow-auto min-w-0'>
          <div className='h-full border border-gray-200 bg-white shadow-sm'>
            <GlobalVariablesPanel />
          </div>
        </div>
      );
    }
    if (leftPanel === 'logic') {
      return (
        <div className='flex-1 overflow-auto min-w-0'>
          <div className='h-full bg-white'>
            <FlowEditor className='w-full h-full' />
          </div>
        </div>
      );
    }
    return (
      <>
        <MaterialPanel materialGroups={materialGroups} />
        <div className='flex-1 p-4 overflow-auto min-w-0'>
          <div className='h-full border border-gray-200 bg-white shadow-sm'>
            <CanvasEditor
              className='size-full'
              renderComponent={EnhancedComponent}
              renderDropPlaceholder={CustomDropPlaceholder}
            />
          </div>
        </div>
        <AttributePanel />
      </>
    );
  }, [leftPanel]);

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
            <div className='w-14 h-full border-r border-gray-200 bg-white'>
              <div className='flex flex-col items-center py-2 space-y-2'>
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    type='button'
                    className={cn(
                      'w-12 h-12 flex flex-col items-center justify-center rounded-md text-gray-700 hover:bg-gray-100',
                      {
                        'bg-gray-100! text-blue-600 border border-blue-200': leftPanel === item.key,
                      },
                    )}
                    onClick={() => setLeftPanel(item.key)}
                  >
                    <span className='text-lg'>{item.icon}</span>
                    <span className='text-[10px] mt-0.5'>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className='flex-1 flex min-w-0'>{renderMainContent()}</div>
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
