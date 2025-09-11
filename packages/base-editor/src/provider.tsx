import React, { useEffect } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import { useEditorStore } from './hooks/use-editor';
import { usePluginStore } from './hooks/use-plugin';
import { uniqueId } from './utils';
import type { Material } from './interface/material';
import type { Plugin } from './interface/plugin';

export interface EditorProviderProps {
  schema?: Schema;
  plugins?: Plugin[];
  materials: Material[];
  children?: React.ReactNode;
}
export const EditorProvider = (props: EditorProviderProps) => {
  const { schema: outerSchema, materials, plugins, children } = props;
  const { schema, setSchema, setMaterials, setActiveElement, setInsertPosition, setDragElement } =
    useEditorStore();

  const {
    addPlugin,
    beforeInsertElement,
    afterInsertElement,
    beforeMoveElement,
    afterMoveElement,
  } = usePluginStore();

  useEffect(() => {
    if (outerSchema) {
      setSchema(outerSchema);
    }
  }, [outerSchema, setSchema]);

  useEffect(() => {
    if (Array.isArray(materials) && materials.length) {
      setMaterials(materials);
    }
  }, [materials]);

  useEffect(() => {
    addPlugin([...(plugins || [])]);
  }, [addPlugin, plugins]);

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
        beforeInsertElement(schema, dropData.id, newElement);
        newSchema = SchemaUtils.insertElement(schema, dropData.id, newElement);
        afterInsertElement(newSchema);
      }
      // 插入到同级元素中
      if (dropData.position && !String(active.id).endsWith('-move')) {
        const newElement = {
          id: uniqueId(dragData.type),
          type: dragData.type,
          props: dragData.defaultProps || {},
        };
        beforeInsertElement(schema, dropData.id, newElement);
        newSchema = SchemaUtils.insertAdjacentElement(
          schema,
          dropData.id,
          newElement,
          dropData.position,
        );
        afterInsertElement(newSchema);
      }
      // 移动元素
      if (String(active.id).endsWith('-move')) {
        const dragElement = dragData as unknown as { id: string; material: Material };
        beforeMoveElement(schema, dragElement.id, dropData.id);
        newSchema = SchemaUtils.moveElement(schema, dragElement.id, dropData.id, {
          mode: 'same-level',
          position: dropData.position || 'after',
        });
        afterMoveElement(newSchema);
      }

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
      {children}
    </DndContext>
  );
};
