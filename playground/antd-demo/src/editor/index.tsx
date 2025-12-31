import React, { useMemo } from 'react';
import { EditorProvider, DragOverlay, useEditorCore, historyPlugin, collaborationPlugin } from '@tangramino/base-editor';
import { LoroDoc } from 'loro-crdt';
import { io } from 'socket.io-client';
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

const materials = materialGroups.flatMap((group) => group.children).concat(BasicPage);

export interface EditorPageProps {
  schema?: Schema;
  /** Enable collaboration mode */
  enableCollab?: boolean;
  /** Collaboration server URL */
  collabServerUrl?: string;
  /** Room ID for collaboration */
  collabRoomId?: string;
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

  const title = useMemo(() => {
    if (dragElement) {
      if ('material' in dragElement) {
        return dragElement.material.title;
      } else {
        return dragElement.title;
      }
    }
  }, [dragElement]);

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
  const {
    schema,
    enableCollab = false,
    collabServerUrl = 'http://localhost:3001',
    collabRoomId = 'demo-room',
  } = props;

  const initialSchema = useMemo(() => {
    return schema || getLocalSchema() || defaultSchema;
  }, [schema]);

  const plugins = useMemo(() => {
    const basePlugins = [historyPlugin({}), materialPlugin(), formPlugin(), portalPlugin()];

    // Add collaboration plugin if enabled
    if (enableCollab) {
      basePlugins.push(
        collaborationPlugin({
          serverUrl: collabServerUrl,
          roomId: collabRoomId,
          loro: { LoroDoc },
          socketIO: io,
        }),
      );
    }

    return basePlugins;
  }, [enableCollab, collabServerUrl, collabRoomId]);

  return (
    <EditorProvider materials={materials} schema={initialSchema} plugins={plugins}>
      <EditorLayout />
    </EditorProvider>
  );
};

export default EditorPage;
