import { SchemaUtils, type Schema } from '@tangramino/engine';
import type { Plugin } from '../interface/plugin';

type InsertOperation = {
  type: 'insert';
  targetId: string;
  insertElement: {
    id: string;
    type: string;
    props?: Record<string, unknown>;
  };
  position?: 'before' | 'after';
};

type MoveOperation = {
  type: 'move';
  sourceId: string;
  targetId: string;
  position?: 'before' | 'after';
  prevParentId?: string | undefined;
  prevIndex?: number;
};

type RemoveElement = {
  parentId: string;
  removeIndex: number;
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: RemoveElement[];
};

type RemoveOperation = {
  type: 'remove';
  removeElement: RemoveElement;
};

type SetPropsOperation = {
  type: 'setProps';
  targetId: string;
  props?: Record<string, unknown>;
};

type HistoryOperation = InsertOperation | MoveOperation | RemoveOperation | SetPropsOperation;

type HistoryOptions = {
  limit?: number;
};

export interface HistoryPlugin extends Plugin {
  undo(schema: Schema): Schema;
  redo(schema: Schema): Schema;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
}

export const historyPlugin = (options?: HistoryOptions): HistoryPlugin => {
  const redos: HistoryOperation[] = [];
  const undos: HistoryOperation[] = [];
  const limit = Math.max(0, options?.limit ?? 100);

  // helper: 获取直接父节点
  const findParentId = (schema: Schema, id: string): string | null => {
    const structure = schema.layout.structure || {};
    for (const [pid, children] of Object.entries(structure)) {
      if (Array.isArray(children) && children.includes(id)) {
        return pid;
      }
    }
    return null;
  };

  // helper: 构建删除快照（子树）
  const buildRemoveElement = (
    schema: Schema,
    id: string,
    parentId: string | null,
  ): RemoveElement => {
    const elemState = schema.elements[id];
    const childrenIds = schema.layout.structure[id] ?? [];
    const removeIndex = parentId ? (schema.layout.structure[parentId]?.indexOf(id) ?? -1) : -1;
    const children = (childrenIds || []).map((cid) => buildRemoveElement(schema, cid, id));
    return {
      parentId: parentId ?? '',
      removeIndex,
      id,
      type: elemState?.type ?? '',
      props: elemState?.props ?? {},
      children,
    };
  };

  // helper: 从快照插入子树（不可变）
  const insertSubtreeAtIndex = (
    schema: Schema,
    parentId: string,
    index: number,
    node: RemoveElement,
  ): Schema => {
    if (!parentId) return schema;
    const newElements = { ...schema.elements };
    const newStructure: Record<string, string[]> = { ...schema.layout.structure };

    const addRecursively = (n: RemoveElement): void => {
      newElements[n.id] = { type: n.type, props: n.props ?? {} };
      newStructure[n.id] = (n.children || []).map((c) => c.id);
      (n.children || []).forEach(addRecursively);
    };

    const parentChildren = newStructure[parentId] ? [...newStructure[parentId]] : [];
    const insertIndex =
      index >= 0 ? Math.min(Math.max(0, index), parentChildren.length) : parentChildren.length;
    const nextChildren = [
      ...parentChildren.slice(0, insertIndex),
      node.id,
      ...parentChildren.slice(insertIndex),
    ];
    newStructure[parentId] = nextChildren;
    addRecursively(node);

    return {
      ...schema,
      elements: newElements,
      layout: { ...schema.layout, structure: newStructure },
      extensions: schema.extensions,
    };
  };

  // helper: 移动到指定父节点并在索引处插入（不可变）
  const moveElementToParentIndex = (
    schema: Schema,
    elementId: string,
    targetParentId: string,
    targetIndex?: number,
  ): Schema => {
    if (!elementId || !targetParentId) return schema;
    const newStructure: Record<string, string[]> = { ...schema.layout.structure };

    const currentParentId = findParentId(schema, elementId);
    if (!currentParentId) return schema;

    const currentChildren = newStructure[currentParentId] ? [...newStructure[currentParentId]] : [];
    const idx = currentChildren.indexOf(elementId);
    if (idx < 0) return schema;
    currentChildren.splice(idx, 1);
    newStructure[currentParentId] = currentChildren;

    const targetChildren = newStructure[targetParentId] ? [...newStructure[targetParentId]] : [];
    const insertIndex =
      typeof targetIndex === 'number'
        ? Math.min(Math.max(0, targetIndex), targetChildren.length)
        : targetChildren.length;
    targetChildren.splice(insertIndex, 0, elementId);
    newStructure[targetParentId] = targetChildren;

    return {
      ...schema,
      layout: { ...schema.layout, structure: newStructure },
      elements: schema.elements,
      extensions: schema.extensions,
    };
  };

  return {
    id: 'history',
    transformSchema: {
      beforeInsertElement: (schema, targetId, element) => {
        undos.push({ type: 'insert', targetId, insertElement: element });
        if (limit > 0 && undos.length > limit) undos.shift();
        redos.length = 0;
      },
      beforeMoveElement: (schema, sourceId, targetId) => {
        const prevParentId = findParentId(schema, sourceId) ?? undefined;
        const prevIndex =
          prevParentId != null
            ? (schema.layout.structure[prevParentId]?.indexOf(sourceId) ?? -1)
            : -1;
        undos.push({
          type: 'move',
          sourceId,
          targetId,
          prevParentId,
          prevIndex,
        });
        if (limit > 0 && undos.length > limit) undos.shift();
        redos.length = 0;
      },
      beforeRemoveElement: (schema, targetId) => {
        const parentId = findParentId(schema, targetId);
        const removeElement = buildRemoveElement(schema, targetId, parentId);
        undos.push({ type: 'remove', removeElement });
        if (limit > 0 && undos.length > limit) undos.shift();
        redos.length = 0;
      },
    },
    undo: (schema: Schema): Schema => {
      const operation = undos.pop();
      if (!operation) return schema;
      let nextSchema: Schema = schema;

      switch (operation.type) {
        case 'insert': {
          // 撤销插入：移除刚插入的元素
          nextSchema = SchemaUtils.removeElement(nextSchema, operation.insertElement.id);
          redos.push(operation);
          if (limit > 0 && redos.length > limit) redos.shift();
          break;
        }
        case 'remove': {
          // 撤销删除：按快照恢复子树
          const snapshot = operation.removeElement;
          nextSchema = insertSubtreeAtIndex(
            nextSchema,
            snapshot.parentId,
            snapshot.removeIndex,
            snapshot,
          );
          redos.push(operation);
          if (limit > 0 && redos.length > limit) redos.shift();
          break;
        }
        case 'move': {
          // 撤销移动：将元素移回原父节点与原索引
          const { sourceId, prevParentId, prevIndex } = operation;
          if (prevParentId) {
            nextSchema = moveElementToParentIndex(nextSchema, sourceId, prevParentId, prevIndex);
          }
          redos.push(operation);
          if (limit > 0 && redos.length > limit) redos.shift();
          break;
        }
        case 'setProps': {
          // 留空：当前未在 hooks 中记录 setProps
          redos.push(operation);
          if (limit > 0 && redos.length > limit) redos.shift();
          break;
        }
      }

      return nextSchema;
    },
    redo: (schema: Schema): Schema => {
      const operation = redos.pop();
      if (!operation) return schema;
      let nextSchema: Schema = schema;

      switch (operation.type) {
        case 'insert': {
          // 重做插入：根据 targetId 是否有父节点选择相邻插入或追加插入
          const hasParent = findParentId(nextSchema, operation.targetId) != null;
          nextSchema = hasParent
            ? SchemaUtils.insertAdjacentElement(
                nextSchema,
                operation.targetId,
                operation.insertElement,
                'after',
              )
            : SchemaUtils.insertElement(nextSchema, operation.targetId, operation.insertElement);
          undos.push(operation);
          if (limit > 0 && undos.length > limit) undos.shift();
          break;
        }
        case 'remove': {
          // 重做删除：移除快照对应子树
          nextSchema = SchemaUtils.removeElement(nextSchema, operation.removeElement.id);
          undos.push(operation);
          if (limit > 0 && undos.length > limit) undos.shift();
          break;
        }
        case 'move': {
          // 重做移动：将元素移到 targetId（跨级追加）
          nextSchema = SchemaUtils.moveElement(nextSchema, operation.sourceId, operation.targetId);
          undos.push(operation);
          if (limit > 0 && undos.length > limit) undos.shift();
          break;
        }
        case 'setProps': {
          undos.push(operation);
          if (limit > 0 && undos.length > limit) undos.shift();
          break;
        }
      }

      return nextSchema;
    },
    canUndo: () => undos.length > 0,
    canRedo: () => redos.length > 0,
    clear: () => {
      undos.length = 0;
      redos.length = 0;
    },
  };
};
