import React, { useMemo } from 'react';
import { CanvasEditor, type Material } from '@tangramino/base-editor';
import { FlowEditor } from '@/flow-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import { SchemaEditor } from './schema-editor';
import { GlobalVariablesPanel } from './global-variables';
import { DataSourcePanel } from './data-source-panel';
import { RightPanel } from './right-panel';
import { AttributePanel } from './attribute-panel';
import { renderDropIndicator } from './drop-indicator';
import { CustomElement } from './custom-element';
import { CustomOverlay } from './custom-overlay';

interface IProps {
  materialGroups: {
    title: string;
    children: Material[];
  }[];
}

export const MainContent = ({ materialGroups }: IProps) => {
  const { leftPanel, viewportWidth } = useEditorContext();

  const content = useMemo(() => {
    switch (leftPanel) {
      case 'schema':
        return (
          <div className='flex-1 p-4 overflow-auto min-w-0'>
            <div className='h-full border border-gray-200 bg-white shadow-sm'>
              <SchemaEditor />
            </div>
          </div>
        );
      case 'globals':
        return (
          <div className='flex-1 p-4 overflow-auto min-w-0'>
            <div className='h-full border border-gray-200 bg-white shadow-sm'>
              <GlobalVariablesPanel />
            </div>
          </div>
        );
      case 'logic':
        return (
          <div className='flex-1 overflow-auto min-w-0'>
            <div className='h-full bg-white'>
              <FlowEditor className='w-full h-full' />
            </div>
          </div>
        );
      case 'datasource':
        return (
          <div className='flex-1 p-4 overflow-auto min-w-0'>
            <div className='h-full border border-gray-200 bg-white shadow-sm'>
              <DataSourcePanel />
            </div>
          </div>
        );
      default:
        return (
          <>
            <RightPanel materialGroups={materialGroups} />
            <div className='flex-1 p-3 overflow-hidden min-w-0'>
              <div
                className='mx-auto border border-gray-200 bg-white shadow-sm h-full min-h-full'
                style={{
                  width: viewportWidth < 1440 && viewportWidth > 568 ? 'auto' : viewportWidth,
                }}
              >
                <CanvasEditor
                  className='size-full relative overflow-auto'
                  renderElement={CustomElement}
                  renderDropIndicator={renderDropIndicator}
                  renderOverlayContent={CustomOverlay}
                />
              </div>
            </div>
            <AttributePanel />
          </>
        );
    }
  }, [leftPanel, viewportWidth, materialGroups]);

  return content;
};
