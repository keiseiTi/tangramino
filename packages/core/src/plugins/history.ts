import type { Plugin } from '../interface/plugin';
import type { Schema } from '@tangramino/engine';

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

  // helper: 找到某个元素的父 id（在 layout.structure 中）
  const findParentId = (schema: Schema, targetId: string): string | null => {
    const structure = schema.layout.structure || {};
    for (const [parentId, children] of Object.entries(structure)) {
      if (Array.isArray(children) && children.includes(targetId)) {
        return parentId;
      }
    }
    // 如果没有 parent，返回 null
    return null;
  };

  // 构建 RemoveElement 快照（包括子树），并包含 parentId 与 removeIndex（在 parent.children 中的位置）
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

  // 根据 targetId 查找并返回 RemoveElement（包含 parentId 和 removeIndex）——用于 beforeRemoveElement、undo 时捕获快照
  const findNodeAndChildren = (schema: Schema, targetId: string): RemoveElement => {
    const parentId = findParentId(schema, targetId);
    // 构建并返回快照
    return buildRemoveElement(schema, targetId, parentId);
  };

  // helpers to apply changes to Schema

  // collect all ids in a RemoveElement subtree
  const collectIds = (node: RemoveElement): string[] => {
    const ids: string[] = [node.id];
    (node.children || []).forEach((c) => ids.push(...collectIds(c)));
    return ids;
  };

  // remove subtree described by RemoveElement from schema (assumes element exists)
  const applyRemove = (schema: Schema, node: RemoveElement): void => {
    // 从父 children 中移除
    const parentId = node.parentId;
    if (parentId) {
      const parentChildren = schema.layout.structure[parentId];
      if (Array.isArray(parentChildren)) {
        // use removeIndex when valid
        if (node.removeIndex >= 0 && parentChildren[node.removeIndex] === node.id) {
          parentChildren.splice(node.removeIndex, 1);
        } else {
          // fallback: 找到并移除
          const idx = parentChildren.indexOf(node.id);
          if (idx >= 0) parentChildren.splice(idx, 1);
        }
      }
    } else {
      // 没有 parentId：可能是根，通常不删除根节点
    }

    // 删除元素与其 layout 记录
    const ids = collectIds(node);
    for (const id of ids) {
      delete schema.elements[id];
      delete schema.layout.structure[id];
    }
  };

  // insert subtree snapshot into parentId at index (如果 index < 0 则 push 到末尾)
  const applyInsertFromSnapshot = (
    schema: Schema,
    parentId: string,
    index: number,
    node: RemoveElement,
  ): void => {
    // ensure parent children array exists
    if (!schema.layout.structure[parentId]) {
      schema.layout.structure[parentId] = [];
    }
    const parentChildren = schema.layout.structure[parentId];
    const insertIndex = index >= 0 ? Math.min(index, parentChildren.length) : parentChildren.length;
    parentChildren.splice(insertIndex, 0, node.id);

    // recursively add nodes into elements & structure
    const recurse = (n: RemoveElement) => {
      schema.elements[n.id] = { type: n.type, props: n.props ?? {} };
      schema.layout.structure[n.id] = (n.children || []).map((c) => c.id);
      (n.children || []).forEach(recurse);
    };
    recurse(node);
  };

  // move element by id into targetParentId at optional index; returns snapshot of moved subtree (original parent info preserved in snapshot)
  const applyMove = (
    schema: Schema,
    elementId: string,
    targetParentId: string,
    targetIndex?: number,
  ): RemoveElement | null => {
    const snapshot = findNodeAndChildren(schema, elementId);
    if (!snapshot) return null;
    // remove from original parent
    applyRemove(schema, snapshot);
    // insert into new parent
    applyInsertFromSnapshot(
      schema,
      targetParentId,
      typeof targetIndex === 'number' ? targetIndex : -1,
      snapshot,
    );
    return snapshot;
  };

  return {
    id: 'history',
    transformSchema: {
      beforeInsertElement: (schema, targetId, element) => {
        undos.push({ type: 'insert', targetId, insertElement: element });
        if (limit > 0 && undos.length > limit) {
          undos.shift();
        }
        redos.length = 0;
      },
      beforeMoveElement: (schema, sourceId, targetId) => {
        undos.push({
          type: 'move',
          sourceId,
          targetId,
        });
        if (limit > 0 && undos.length > limit) {
          undos.shift();
        }
        redos.length = 0;
      },
      beforeRemoveElement: (schema, targetId) => {
        const removeElement = findNodeAndChildren(schema, targetId);
        undos.push({ type: 'remove', removeElement });
        if (limit > 0 && undos.length > limit) {
          undos.shift();
        }
        redos.length = 0;
      },
    },
    undo: (schema: Schema): Schema => {
      const operation = undos.pop();
      if (!operation) return schema;
      const nextSchema = schema as Schema;

      switch (operation.type) {
        case 'insert': {
          // 撤销插入：删除刚插入的元素（并保存快照以便 redo 可以重新插入）
          // const insertId = operation.insertElementId;
          // const snapshot = findNodeAndChildren(nextSchema, insertId);
          // if (snapshot && nextSchema.elements[insertId]) {
          //   // remove from schema
          //   applyRemove(nextSchema, snapshot);
          //   // push inverse（redo 时需要知道如何重新插入，保存快照在 elementSnapshot 字段）
          //   const inverse: InsertOperation = {
          //     type: 'insert',
          //     targetId: operation.targetId,
          //     insertElementId: insertId,
          //     elementSnapshot: snapshot,
          //   };
          //   redos.push(inverse);
          //   if (limit > 0 && redos.length > limit) redos.shift();
          // } else {
          //   // 元素不存在 — 仍然将簡單的 inverse push 到 redos（无法重做）
          //   redos.push(operation);
          //   if (limit > 0 && redos.length > limit) redos.shift();
          // }
          // break;
        }
        case 'remove': {
          // 撤销删除：将快照插回去
          // const removeOp = operation.removeElement;
          // applyInsertFromSnapshot(nextSchema, removeOp.parentId, removeOp.removeIndex, removeOp);
          // // redo 时应该再次删除，所以把原来的 removeOp push 到 redos
          // redos.push(operation);
          // if (limit > 0 && redos.length > limit) redos.shift();
          // break;
        }
        case 'move': {
          // 撤销移动：把元素移回原来的父容器/位置
          // const mv = operation as MoveOperation;
          // // 当前元素应该在 mv.targetId (移动后的位置)，我们需要把它移回 prevParentId
          // const prevParentId = mv.prevParentId ?? '';
          // const prevIndex = typeof mv.prevIndex === 'number' ? mv.prevIndex : -1;
          // // remove from current position and insert back to prevParentId
          // // 使用 applyMove 从当前所在位置（通过 element id 查找）移动到 prevParentId
          // applyMove(nextSchema, mv.sourceId, prevParentId, prevIndex);
          // // redo 应该再次把它移到 targetId（即原始移动），所以把原始操作 push 到 redos
          // redos.push(operation);
          // if (limit > 0 && redos.length > limit) redos.shift();
          // break;
        }
        case 'setProps': {
          // 撤销 setProps：交换 props（假设 operation.props 存的是被替换前的旧 props）
          // const op = operation as SetPropsOperation;
          // const el = nextSchema.elements[op.targetId];
          // const oldProps = el?.props ?? {};
          // // 恢复旧 props（operation.props）
          // if (el) {
          //   el.props = op.props ?? {};
          // }
          // // 将 inverse 推到 redo（保存当前 props 以便 redo 时恢复）
          // const inverse: SetPropsOperation = {
          //   type: 'setProps',
          //   targetId: op.targetId,
          //   props: oldProps,
          // };
          // redos.push(inverse);
          // if (limit > 0 && redos.length > limit) redos.shift();
          // break;
        }
      }

      return nextSchema;
    },
    redo: (schema: Schema): Schema => {
      const operation = redos.pop();
      if (!operation) return schema;
      const nextSchema = schema as Schema;

      switch (operation.type) {
        case 'insert': {
          // redo 插入：如果有快照则从快照插回；否则尝试基于 id 简单插入（如果无法找到快照则无操作）
          // const op = operation as InsertOperation;
          // if (op.elementSnapshot) {
          //   applyInsertFromSnapshot(nextSchema, op.targetId, -1, op.elementSnapshot);
          //   // redo 的 inverse 是删除该元素 -> push 对应的 remove 快照到 undos
          //   const inverseRemove: RemoveOperation = {
          //     type: 'remove',
          //     removeElement: op.elementSnapshot,
          //   };
          //   undos.push(inverseRemove);
          //   if (limit > 0 && undos.length > limit) undos.shift();
          // } else {
          //   // 没有快照：尝试从 schema.elements 中查找 id，如果元素已经存在则不再插入
          //   // 在不能保证能重建的情况下，只把操作放回 undos 以保持状态
          //   undos.push(operation);
          //   if (limit > 0 && undos.length > limit) undos.shift();
          // }
          break;
        }
        case 'remove': {
          // redo 删除：应用 remove 快照
          // const op = operation as RemoveOperation;
          // applyRemove(nextSchema, op.removeElement);
          // // inverse（undo）应该恢复该快照，所以把 op 推回 undos
          // undos.push(operation);
          // if (limit > 0 && undos.length > limit) undos.shift();
          // break;
        }
        case 'move': {
          // redo 移动：将元素从当前所在位置移动到 operation.targetId
          // const mv = operation as MoveOperation;
          // // 为了能够再次 undo，需要在 undos 中保存移动前的位置（即当前所在位置）
          // // 在执行移动前先捕获当前父信息
          // const beforeSnapshot = findNodeAndChildren(nextSchema, mv.sourceId);
          // // 执行移动（将元素移动到 targetId）
          // applyMove(nextSchema, mv.sourceId, mv.targetId);
          // // 推回一个包含 prevParentId/prevIndex 的 move 到 undos，以便可以 undo（回到 beforeSnapshot）
          // const inverse: MoveOperation = {
          //   type: 'move',
          //   sourceId: mv.sourceId,
          //   targetId: mv.targetId,
          //   prevParentId: beforeSnapshot.parentId || undefined,
          //   prevIndex: beforeSnapshot.removeIndex,
          // };
          // undos.push(inverse);
          // if (limit > 0 && undos.length > limit) undos.shift();
          // break;
        }
        case 'setProps': {
          // const op = operation as SetPropsOperation;
          // const el = nextSchema.elements[op.targetId];
          // const oldProps = el?.props ?? {};
          // if (el) {
          //   el.props = op.props ?? {};
          // }
          // // 推回 inverse 到 undos
          // const inverse: SetPropsOperation = {
          //   type: 'setProps',
          //   targetId: op.targetId,
          //   props: oldProps,
          // };
          // undos.push(inverse);
          // if (limit > 0 && undos.length > limit) undos.shift();
          // break;
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
