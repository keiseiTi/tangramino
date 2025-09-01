import type { Plugin } from '../interface/plugin';
import type { Schema } from '@tangramino/engine';

type InsertOperation = {
  type: 'insert';
  targetId: string;
  element: {
    id: string;
    props?: Record<string, unknown>;
  };
};

type MoveOperation = {
  type: 'move';
  sourceId: string;
  targetId: string;
};

type RemoveOperation = {
  type: 'remove';
  targetId: string;
};

// 历史记录项
type HistoryOperation = InsertOperation | MoveOperation | RemoveOperation;

// 可选配置
type HistoryOptions = {
  limit?: number; // 历史最大长度，超出时丢弃最早记录
};

export interface HistoryPlugin extends Plugin {
  // undo(): void;
  // redo(): void;
  // canUndo(): boolean;
  // canRedo(): boolean;
  // clear(): void;
}

const historyPlugin = (options?: HistoryOptions): HistoryPlugin => {
  const redos: HistoryOperation[] = [];
  const undos: HistoryOperation[] = [];
  const limit = Math.max(0, options?.limit ?? 100);

  // let lastBefore: Schema | null = null;
  // let lastType: HistoryOperation['type'] | null = null;

  // const pushUndo = (entry: HistoryOperation) => {
  //   undos.push(entry);
  //   // 新的操作产生后，重做栈失效
  //   redos.length = 0;
  //   // 超出上限，丢弃最早记录
  //   if (limit > 0 && undos.length > limit) {
  //     undos.shift();
  //   }
  // };

  return {
    id: 'history',
    transformSchema: {
      beforeInsertElement: (schema, targetId, element) => {
        undos.push({ type: 'insert', targetId, element });
      },
      beforeMoveElement: (schema, sourceId, targetId) => {
        undos.push({ type: 'move', sourceId, targetId });
      },
      beforeRemoveElement: (schema, targetId) => {
        undos.push({ type: 'remove', targetId });
      },
    },
    // undo: (current: Schema): Schema => {
    //   const entry = undos.pop();
    //   if (!entry) return current;
    //   redos.push(entry);
    //   return entry.before;
    // },
    // // @ts-ignore
    // redo: (current: Schema): Schema => {
    //   const entry = redos.pop();
    //   if (!entry) return current;
    //   undos.push(entry);
    //   return entry.after;
    // },
    // // @ts-ignore
    // canUndo: () => undos.length > 0,
    // // @ts-ignore
    // canRedo: () => redos.length > 0,
    // // @ts-ignore
    // clear: () => {
    //   undos.length = 0;
    //   redos.length = 0;
    //   lastBefore = null;
    //   lastType = null;
    // },
  };
};

export default historyPlugin;
