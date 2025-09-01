import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import { Operation } from './components/operation';
import { CanvasEditor } from './components/canvas-editor';
import { MaterialPanel } from './components/material-panel';
import { AttributePanel } from './components/attribute-panel';
import { useEditorStore } from './hooks/editor';
import { historyPlugin } from './plugins/history';
import { usePluginStore } from './hooks/plugin';
import { uniqueId } from './utils';
import type { Material } from './interface/material';
import './editor.css';


interface EditorProps {
  materials: Material[];
  schema?: Schema;
}

export const Editor = (props: EditorProps) => {
  const { materials, schema: outerSchema } = props;
  const { schema, setSchema, setActiveElement, setInsertPosition } = useEditorStore();
  const [dragElement, setDragElement] = useState<Material | null>(null);

  const { addPlugin } = usePluginStore();

  useEffect(() => {
    addPlugin(historyPlugin());
  }, [addPlugin]);

  useEffect(() => {
    if (outerSchema) {
      setSchema(outerSchema);
    }
  }, [outerSchema, setSchema]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (String(active.id).endsWith('-move')) {
      setDragElement(event.active.data.current?.material as Material);
    } else {
      setDragElement(event.active.data.current as Material);
    }
    setActiveElement(null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) {
      onDragCancel();
      return;
    }

    const dragData = active.data.current as Material;
    const dropData = over.data.current as {
      id: string;
      props: Record<string, unknown>;
      position?: 'before' | 'after';
    };

    if (dragData && dropData) {
      let newSchema: Schema = schema;
      // 插入元素
      if (String(over.id).endsWith('-placeholder')) {
        const newElement = {
          id: uniqueId(dragData.type),
          type: dragData.type,
          props: dragData.defaultProps || {},
        };
        newSchema = SchemaUtils.insertElement(schema, dropData.id, newElement);
      }
      // 插入到同级元素中
      if (dropData.position && !String(active.id).endsWith('-move')) {
        const newElement = {
          id: uniqueId(dragData.type),
          type: dragData.type,
          props: dragData.defaultProps || {},
        };
        newSchema = SchemaUtils.insertAdjacentElement(
          schema,
          dropData.id,
          newElement,
          dropData.position,
        );
      }
      // 移动元素
      if (String(active.id).endsWith('-move')) {
        const dragElement = dragData as unknown as { id: string; material: Material };
        newSchema = SchemaUtils.moveElement(schema, dragElement.id, dropData.id, {
          mode: 'same-level',
          position: dropData.position || 'after',
        });
      }

      // debugger
      setSchema(newSchema);
    }

    onDragCancel();
  };

  const onDragMove = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over || String(over.id).endsWith('-placeholder')) return;
    const midX = over.rect.left + over.rect.width / 2;
    const pointX = active.rect.current.translated?.left || 0;
    const pos = pointX < midX ? 'before' : 'after';
    setInsertPosition({
      id: String(over.id),
      position: pos,
    });
  };

  const onDragCancel = () => {
    setDragElement(null);
    setInsertPosition(null);
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragAbort={onDragCancel}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className='flex flex-col w-full h-full'>
        <Operation />
        <div className='flex flex-1'>
          <MaterialPanel materials={materials} />
          <CanvasEditor className='flex-1' materials={materials} />
          <AttributePanel />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {dragElement && (
          <div className='w-24 p-1 text-xs flex justify-center items-center rounded-sm border border-slate-600 bg-[#fafafabf] cursor-copy'>
            <span className='text-store-600'>{dragElement.title}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
