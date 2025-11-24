import React, { useEffect } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import { useEditorCore } from './hooks/use-editor-core';
import { usePluginCore } from './hooks/use-plugin';
import { uniqueId } from './utils';
import type { Material } from './interface/material';
import type { Plugin } from './interface/plugin';

/**
 * Props for the EditorProvider component
 */
export interface EditorProviderProps {
  /** Initial schema for the editor */
  schema?: Schema;
  /** Array of plugins to extend editor functionality */
  plugins?: Plugin[];
  /** Array of available materials (components) that can be used in the editor */
  materials: Material[];
  /** Child components to render within the editor context */
  children?: React.ReactNode;
  /** Callback fired when the schema changes */
  onChange?: (schema: Schema) => void;
}

/**
 * EditorProvider is the root component that provides editor context and drag-and-drop functionality
 * Manages schema state, plugins, materials, and handles all drag-and-drop operations
 *
 * @example
 * ```tsx
 * <EditorProvider
 *   schema={initialSchema}
 *   materials={[ButtonMaterial, InputMaterial]}
 *   plugins={[historyPlugin, modePlugin]}
 *   onChange={(newSchema) => console.log('Schema changed:', newSchema)}
 * >
 *   <CanvasEditor />
 * </EditorProvider>
 * ```
 */
export const EditorProvider = (props: EditorProviderProps) => {
  const { schema: outerSchema, materials, plugins, children, onChange } = props;
  const { schema, setSchema, setMaterials, setActiveElement, setInsertPosition, setDragElement } =
    useEditorCore();

  const {
    addPlugin,
    beforeInsertElement,
    afterInsertElement,
    beforeMoveElement,
    afterMoveElement,
    beforeInitMaterials,
  } = usePluginCore();

  useEffect(() => {
    if (outerSchema) {
      setSchema(outerSchema);
    }
  }, [outerSchema, setSchema]);

  useEffect(() => {
    addPlugin([...(plugins || [])]);
  }, []);

  useEffect(() => {
    if (Array.isArray(materials) && materials.length) {
      beforeInitMaterials(materials);
      setMaterials(materials);
    }
  }, [materials, beforeInitMaterials]);

  useEffect(() => {
    onChange?.(schema);
  }, [schema, onChange]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (String(active.id).endsWith('-move')) {
      setDragElement(event.active.data.current?.material as Material);
    } else {
      setDragElement(event.active.data.current as Material);
    }
    setActiveElement(null);
  };

  const onDragMove = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over) return;
    const overId = over.data.current!.id as string;
    const activeMaterial = active.data.current as Material;
    const overMaterial = over.data.current!.material as Material;
    if (activeMaterial.isContainer && overMaterial.isContainer) {
      const midY = over.rect.top + over.rect.height / 2;
      const pointY = active.rect.current.translated?.top || 0;
      const pos = pointY < midY ? 'up' : 'down';
      setInsertPosition({ id: overId, position: pos });
    }
    if (String(over.id).endsWith('-placeholder')) return;
    const midX = over.rect.left + over.rect.width / 2;
    const pointX = active.rect.current.translated?.left || 0;
    const pos = pointX < midX ? 'before' : 'after';
    setInsertPosition({ id: overId, position: pos });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) {
      onDragCancel();
      return;
    }

    const dragData = active.data.current as unknown;
    const dropData = over.data.current as {
      id: string;
      props: Record<string, unknown>;
      position?: 'before' | 'after' | 'up' | 'down';
    };

    if (dragData && dropData) {
      let newSchema: Schema = schema;
      // 插入元素
      if (!String(active.id).endsWith('-move')) {
        const newElement = {
          id: uniqueId((dragData as Material).type),
          type: (dragData as Material).type,
          props: (dragData as Material).defaultProps || {},
        };
        beforeInsertElement(schema, dropData.id, newElement);
        if (dropData.position) {
          newSchema = SchemaUtils.insertAdjacentElement(
            schema,
            dropData.id,
            newElement,
            dropData.position as 'before' | 'after' | 'up' | 'down',
          );
        } else {
          newSchema = SchemaUtils.insertElement(schema, dropData.id, newElement);
        }
        afterInsertElement(newSchema);
      }
      // 移动元素
      if (String(active.id).endsWith('-move')) {
        const dragElement = dragData as { id: string; material: Material };
        beforeMoveElement(schema, dragElement.id, dropData.id);
        if (dropData.position === 'up' || dropData.position === 'down') {
          newSchema = SchemaUtils.moveElement(schema, dragElement.id, dropData.id, {
            mode: 'cross-level',
            position: dropData.position,
          });
        } else {
          newSchema = SchemaUtils.moveElement(schema, dragElement.id, dropData.id, {
            mode: 'same-level',
            position: (dropData.position as 'before' | 'after') || 'after',
          });
        }
        afterMoveElement(newSchema);
      }

      setSchema(newSchema);
    }

    onDragCancel();
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
