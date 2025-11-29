import React, { useEffect } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import { useEditorCore } from './hooks/use-editor-core';
import { usePluginCore } from './hooks/use-plugin-core';
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
  const {
    schema,
    engine,
    setSchema,
    setMaterials,
    setActiveElement,
    setInsertPosition,
    setDragElement,
  } = useEditorCore();

  const {
    addPlugins,
    removePlugins,
    beforeInsertElement,
    afterInsertElement,
    beforeMoveElement,
    afterMoveElement,
    beforeInitMaterials,
    afterInsertMaterial,
  } = usePluginCore();

  useEffect(() => {
    if (outerSchema) {
      setSchema(outerSchema);
    }
  }, [outerSchema, setSchema]);

  useEffect(() => {
    addPlugins([...(plugins || [])]);
    return () => {
      removePlugins();
    };
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

  useEffect(() => {
    engine.changeSchema(schema);
  }, [schema]);

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
    const threshold = 10;
    if (activeMaterial.isContainer && overMaterial.isContainer) {
      const pointTop = active.rect.current.translated?.top || 0;
      const pointBottom = active.rect.current.translated?.bottom || 0;
      const top = over.rect.top;
      const bottom = over.rect.bottom ?? over.rect.top + over.rect.height;
      const distTop = Math.abs(pointTop - top);
      const distBottom = Math.abs(bottom - pointBottom);
      if (distTop > threshold && distBottom > threshold) {
        setInsertPosition(null);
      } else {
        const pos = distTop <= distBottom ? 'up' : 'down';
        setInsertPosition({ id: overId, position: pos });
      }
    } else {
      if (String(over.id).endsWith('-placeholder')) return;
      const pointLeft = active.rect.current.translated?.left || 0;
      const pointRight = active.rect.current.translated?.right || 0;
      const left = over.rect.left;
      const right = over.rect.right;
      const distLeft = Math.abs(pointLeft - left);
      const distRight = Math.abs(right - pointRight);
      if (distLeft > threshold && distRight > threshold) {
        setInsertPosition(null);
      } else {
        const pos = distLeft <= distRight ? 'before' : 'after';
        setInsertPosition({ id: overId, position: pos });
      }
    }
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
      material: Material;
      position?: 'before' | 'after' | 'up' | 'down';
    };

    if (dragData && dropData) {
      let newSchema: Schema = schema;
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
      } else {
        // 插入元素
        const dragMaterial = dragData as Material;
        const newElement = {
          id: uniqueId(dragMaterial.type),
          type: dragMaterial.type,
          props: dragMaterial.defaultProps || {},
        };
        let canDropElement = dropData.material;
        if (!canDropElement.isContainer) {
          const parentElementId = SchemaUtils.getParents(schema, dropData.id)[0];
          const parentElement = SchemaUtils.getElementById(schema, parentElementId!);
          canDropElement = materials.find((material) => material.type === parentElement.type)!;
        }
        if (
          dragMaterial.dropTypes &&
          canDropElement.isContainer &&
          !dragMaterial.dropTypes.includes(canDropElement.type) &&
          !dropData.position
        ) {
          console.warn('not allowed to drag in');
          onDragCancel();
          return;
        }
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
        afterInsertMaterial(
          {
            ...newElement,
            material: dragMaterial,
          },
          {
            id: dropData.id,
            type: dropData.material.type,
            props: dropData.props,
          },
        );
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
