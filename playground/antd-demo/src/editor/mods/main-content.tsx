import React from 'react';
import { CanvasEditor, type Material } from '@tangramino/base-editor';
import { FlowEditor } from '@/flow-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import { SchemaEditor } from './schema-editor';
import { GlobalVariablesPanel } from './global-variables';
import { DataSourcePanel } from './data-source-panel';
import { MaterialPanel } from './material-panel';
import { AttributePanel } from './attribute-panel';
import { CustomDropPlaceholder } from './drop-placeholder';
import { EnhancedComponent } from './enhanced-comp';

interface IProps {
  materialGroups: {
    title: string;
    children: Material[];
  }[];
}

export const MainContent = ({ materialGroups }: IProps) => {
  const { leftPanel } = useEditorContext();

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
  if (leftPanel === 'datasource') {
    return (
      <div className='flex-1 p-4 overflow-auto min-w-0'>
        <div className='h-full border border-gray-200 bg-white shadow-sm'>
          <DataSourcePanel />
        </div>
      </div>
    );
  }
  return (
    <>
      <MaterialPanel materialGroups={materialGroups} />
      <div className='flex-1 p-3 overflow-hidden min-w-0'>
        <div className='h-full border border-gray-200 bg-white shadow-sm overflow-auto'>
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
};
