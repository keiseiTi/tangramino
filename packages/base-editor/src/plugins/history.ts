import { SchemaUtils, type Schema } from '@tangramino/engine';
import type { EditorPlugin, PluginContext } from '../interface/plugin';
import { definePlugin } from '../utils/define-plugin';

/**
 * History 插件配置选项
 */
interface HistoryOptions {
  /** 历史记录最大数量，默认 100 */
  limit?: number;
}

/**
 * History 插件扩展接口
 */
interface HistoryPluginExtension {
  /** 撤销操作 */
  undo: () => void;
  /** 重做操作 */
  redo: () => void;
  /** 是否可以撤销 */
  canUndo: () => boolean;
  /** 是否可以重做 */
  canRedo: () => boolean;
  /** 清空历史记录 */
  clear: () => void;
}

/**
 * History 插件类型
 */
export type HistoryPlugin = EditorPlugin & HistoryPluginExtension;

// ============================================================
// 历史操作类型定义
// ============================================================

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
  prevProps?: Record<string, unknown>;
};

type HistoryOperation = InsertOperation | MoveOperation | RemoveOperation | SetPropsOperation;

// ============================================================
// 历史插件实现
// ============================================================

/**
 * 历史记录插件 - 提供撤销/重做功能
 *
 * @example
 * const history = historyPlugin({ limit: 50 });
 * // 使用: const historyInstance = ctx.getPlugin<HistoryPlugin>('history');
 * // historyInstance?.undo();
 */
export const historyPlugin = definePlugin<HistoryPlugin, HistoryOptions | undefined>(
  (options) => {
    const limit = Math.max(0, options?.limit ?? 100);
    const redos: HistoryOperation[] = [];
    const undos: HistoryOperation[] = [];
    let ctx: PluginContext | null = null;

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

      const currentChildren = newStructure[currentParentId]
        ? [...newStructure[currentParentId]]
        : [];
      const idx = currentChildren.indexOf(elementId);
      if (idx < 0) return schema;
      currentChildren.splice(idx, 1);
      newStructure[currentParentId] = currentChildren;

      const targetChildren = newStructure[targetParentId]
        ? [...newStructure[targetParentId]]
        : [];
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

    const performUndo = (): void => {
      if (!ctx) return;
      const schema = ctx.getSchema();
      if (!schema) {
        console.warn('[historyPlugin] Cannot undo: schema is undefined');
        return;
      }

      const operation = undos.pop();
      if (!operation) return;

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
          nextSchema = SchemaUtils.setElementProps(
            nextSchema,
            operation.targetId,
            operation.prevProps || {},
          );
          redos.push(operation);
          if (limit > 0 && redos.length > limit) redos.shift();
          break;
        }
      }

      ctx.setSchema(nextSchema);
    };

    const performRedo = (): void => {
      if (!ctx) return;
      const schema = ctx.getSchema();
      if (!schema) {
        console.warn('[historyPlugin] Cannot redo: schema is undefined');
        return;
      }

      const operation = redos.pop();
      if (!operation) return;

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
          nextSchema = SchemaUtils.setElementProps(
            nextSchema,
            operation.targetId,
            operation.props || {},
          );
          undos.push(operation);
          if (limit > 0 && undos.length > limit) undos.shift();
          break;
        }
      }

      ctx.setSchema(nextSchema);
    };

    return {
      id: 'history',
      priority: 0, // 最先执行，确保记录所有操作

      onInit(context: PluginContext) {
        ctx = context;
        return () => {
          undos.length = 0;
          redos.length = 0;
          ctx = null;
        };
      },

      onBeforeInsert(schema, targetId, element) {
        undos.push({ type: 'insert', targetId, insertElement: element });
        if (limit > 0 && undos.length > limit) undos.shift();
        redos.length = 0;
      },

      onBeforeMove(schema, sourceId, targetId) {
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

      onBeforeRemove(schema, targetId) {
        const parentId = findParentId(schema, targetId);
        const removeElement = buildRemoveElement(schema, targetId, parentId);
        undos.push({ type: 'remove', removeElement });
        if (limit > 0 && undos.length > limit) undos.shift();
        redos.length = 0;
      },

      onBeforeUpdateProps(schema, targetId, props) {
        const prevState = schema.elements[targetId]?.props || {};
        const prevProps: Record<string, unknown> = {};
        Object.keys(props || {}).forEach((k) => {
          prevProps[k] = prevState[k];
        });
        undos.push({ type: 'setProps', targetId, props, prevProps });
        if (limit > 0 && undos.length > limit) undos.shift();
        redos.length = 0;
      },

      undo: performUndo,
      redo: performRedo,
      canUndo: () => undos.length > 0,
      canRedo: () => redos.length > 0,
      clear: () => {
        undos.length = 0;
        redos.length = 0;
      },
    };
  },
);
