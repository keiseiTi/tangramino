import React, { useEffect, useLayoutEffect, useCallback } from 'react';
import {
  DndContext,
  pointerWithin,
  rectIntersection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type CollisionDetection,
} from '@dnd-kit/core';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import { useShallow } from 'zustand/react/shallow';
import { useEditorCore, type DragElement } from './hooks/use-editor-core';
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
    insertPosition,
    dragElement,
    setSchema,
    setMaterials,
    setActiveElement,
    setInsertPosition,
    setDragElement,
  } = useEditorCore(
    useShallow((state) => ({
      schema: state.schema,
      engine: state.engine,
      insertPosition: state.insertPosition,
      dragElement: state.dragElement,
      setSchema: state.setSchema,
      setMaterials: state.setMaterials,
      setActiveElement: state.setActiveElement,
      setInsertPosition: state.setInsertPosition,
      setDragElement: state.setDragElement,
    })),
  );

  const {
    addPlugins,
    removePlugins,
    beforeInsertElement,
    afterInsertElement,
    beforeMoveElement,
    afterMoveElement,
    beforeInitMaterials,
    beforeInsertMaterial,
    afterInsertMaterial,
    afterCanvasUpdated,
  } = usePluginCore();

  useLayoutEffect(() => {
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
  }, [materials, beforeInitMaterials, setMaterials]);

  useLayoutEffect(() => {
    onChange?.(schema);
    engine.changeSchema(schema);
    afterCanvasUpdated(engine);
  }, [schema, engine, onChange, afterCanvasUpdated]);

  // 自定义碰撞检测策略：优先使用指针检测，如果没有结果则使用矩形相交
  // 这样可以确保在滚动容器中也能正确检测到 placeholder
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // 首先尝试使用 pointerWithin，它基于鼠标指针位置
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      // 如果有多个碰撞，优先选择 placeholder（id 包含 '-placeholder'）
      const placeholderCollision = pointerCollisions.find((collision) =>
        String(collision.id).endsWith('-placeholder'),
      );

      if (placeholderCollision) {
        return [placeholderCollision];
      }

      return pointerCollisions;
    }

    // 如果 pointerWithin 没有结果，回退到 rectIntersection
    return rectIntersection(args);
  }, []);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDragElement(active.data.current as DragElement);
    setActiveElement(null);
  };

  // 工具函数：确定目标容器类型
  const getTargetContainerType = (
    dropData: { id: string; material: Material },
    position?: 'before' | 'after' | 'up' | 'down',
  ): string | null => {
    if (position) {
      // 有位置信息时，检查目标元素的父容器
      const parentElementId = SchemaUtils.getParents(schema, dropData.id)[0];
      if (parentElementId) {
        const parentElement = SchemaUtils.getElementById(schema, parentElementId);
        return parentElement.type || '';
      }
      return null; // 没有父元素
    } else {
      // 没有位置信息时，检查目标元素本身或其父容器
      if (dropData.material.isContainer) {
        return dropData.material.type;
      } else {
        const parentElementId = SchemaUtils.getParents(schema, dropData.id)[0];
        if (parentElementId) {
          const parentElement = SchemaUtils.getElementById(schema, parentElementId);
          return parentElement.type!;
        }
        return null;
      }
    }
  };

  // 工具函数：检查 dropTypes 限制
  const checkDropTypes = (
    dropTypes: string[] | undefined,
    targetContainerType: string | null,
    operationType: 'move' | 'insert',
  ): boolean => {
    if (!dropTypes) return true;
    if (!targetContainerType) {
      console.warn(`Cannot ${operationType}: no parent element`);
      return false;
    }
    if (!dropTypes.includes(targetContainerType)) {
      console.warn(`not allowed to ${operationType} into ${targetContainerType}`);
      return false;
    }
    return true;
  };

  const onDragMove = (event: DragOverEvent) => {
    const { over, active, delta } = event;
    if (!over) return;
    const overId = over.data.current!.id as string;
    const overMaterial = over.data.current!.material as Material;
    const threshold = 10;

    // 获取被拖拽元素的 material 信息
    const dragData = dragElement ?? active.data.current;
    let dragMaterial: Material | undefined;

    if (dragData) {
      // 判断是移动元素还是插入新元素
      if ('material' in dragData) {
        // 移动元素：dragData 是 { id, props, material }
        dragMaterial = dragData.material as Material;
      } else if ('type' in dragData) {
        // 插入新元素：dragData 是 Material
        dragMaterial = dragData as Material;
      }
    }

    // 判断被拖拽元素是否为 Block 元素（容器也是 Block）
    const isDragBlock = dragMaterial?.isBlock || dragMaterial?.isContainer;
    // 判断目标元素是否为 Block 元素
    const isOverBlock = overMaterial.isBlock || overMaterial.isContainer;

    // 规则：
    // 1. Block 元素只能在 Block 元素的上下方插入（up/down）
    // 2. 非 Block 元素只能在非 Block 元素的左右插入（before/after），即插入到 Block 内部

    if (isDragBlock) {
      // 拖拽的是 Block 元素，只能在 Block 元素上下插入
      if (isOverBlock) {
        // 使用 delta 和初始位置计算当前鼠标位置
        const activeInitialTop = active.rect.current.initial?.top || 0;
        const activeInitialBottom = active.rect.current.initial?.bottom || 0;
        const pointTop = activeInitialTop + delta.y;
        const pointBottom = activeInitialBottom + delta.y;

        const top = over.rect.top;
        const bottom = over.rect.bottom ?? over.rect.top + over.rect.height;
        const distTop = Math.abs(pointTop - top);
        const distBottom = Math.abs(bottom - pointBottom);
        if (distTop > threshold && distBottom > threshold) {
          if (insertPosition !== null) {
            setInsertPosition(null);
          }
        } else {
          const pos = distTop <= distBottom ? 'up' : 'down';
          if (insertPosition?.id !== overId || insertPosition?.position !== pos) {
            setInsertPosition({ id: overId, position: pos });
          }
        }
      } else {
        // Block 元素不能在非 Block 元素位置插入，清除位置指示
        if (insertPosition !== null) {
          setInsertPosition(null);
        }
      }
    } else {
      // 拖拽的是非 Block 元素，只能在非 Block 元素左右插入
      if (!isOverBlock) {
        if (String(over.id).endsWith('-placeholder')) return;
        // 使用 delta 和初始位置计算当前鼠标位置
        const activeInitialLeft = active.rect.current.initial?.left || 0;
        const activeInitialRight = active.rect.current.initial?.right || 0;
        const pointLeft = activeInitialLeft + delta.x;
        const pointRight = activeInitialRight + delta.x;

        const left = over.rect.left;
        const right = over.rect.right;
        const distLeft = Math.abs(pointLeft - left);
        const distRight = Math.abs(right - pointRight);
        if (distLeft > threshold && distRight > threshold) {
          if (insertPosition !== null) {
            setInsertPosition(null);
          }
        } else {
          const pos = distLeft <= distRight ? 'before' : 'after';
          if (insertPosition?.id !== overId || insertPosition?.position !== pos) {
            setInsertPosition({ id: overId, position: pos });
          }
        }
      } else {
        // 目标是 Block 元素（容器）
        // 非 Block 元素可以插入到容器内部，但不显示边缘指示（会在 onDragEnd 时插入到容器内部）
        if (insertPosition !== null) {
          setInsertPosition(null);
        }
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) {
      onDragCancel();
      return;
    }

    // 优先使用保存的拖拽数据，如果没有则使用 event 中的数据
    const dragData = dragElement ?? active.data.current;
    const dropData = over.data.current as {
      id: string;
      props: Record<string, unknown>;
      material: Material;
    };
    const position = insertPosition?.id === dropData.id ? insertPosition.position : undefined;

    if (dragData && dropData) {
      let newSchema: Schema = schema;
      // 移动元素
      if (String(active.id).endsWith('-move')) {
        const dragElement = dragData as { id: string; material: Material };

        // 检查 dropTypes 限制
        const targetContainerType = getTargetContainerType(dropData, position);
        if (!checkDropTypes(dragElement.material.dropTypes, targetContainerType, 'move')) {
          onDragCancel();
          return;
        }

        beforeMoveElement(schema, dragElement.id, dropData.id);
        if (position) {
          // 有位置信息时，使用同级移动（before/after/up/down）
          newSchema = SchemaUtils.moveElement(schema, dragElement.id, dropData.id, {
            mode: 'same-level',
            position: position,
          });
        } else {
          // 没有位置信息时，使用跨级移动（插入到容器内部）
          newSchema = SchemaUtils.moveElement(schema, dragElement.id, dropData.id, {
            mode: 'cross-level',
          });
        }
        afterMoveElement(newSchema);
      } else {
        // 插入元素
        const dragMaterial = dragData as Material;
        let newElement = {
          id: uniqueId(dragMaterial.type),
          type: dragMaterial.type,
          props: dragMaterial.defaultProps || {},
        };

        // 检查 dropTypes 限制
        const targetContainerType = getTargetContainerType(dropData, position);
        if (!checkDropTypes(dragMaterial.dropTypes, targetContainerType, 'insert')) {
          onDragCancel();
          return;
        }

        beforeInsertElement(schema, dropData.id, newElement);
        newElement = beforeInsertMaterial(
          {
            ...newElement,
            material: dragMaterial,
          },
          newElement,
        );
        if (position) {
          newSchema = SchemaUtils.insertAdjacentElement(
            schema,
            dropData.id,
            newElement,
            position as 'before' | 'after' | 'up' | 'down',
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
      collisionDetection={customCollisionDetection}
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
