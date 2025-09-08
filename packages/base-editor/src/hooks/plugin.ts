import { create } from 'zustand';
import type { Plugin } from '../interface/plugin';
import type { Schema, InsertElement } from '@tangramino/engine';

export interface PluginStore {
  plugins: Plugin[];
  addPlugin: (plugins: Plugin[]) => void;
  beforeInsertElement: (schema: Schema, targetId: string, insertElement: InsertElement) => void;
  afterInsertElement: (schema: Schema) => void;
  beforeMoveElement: (schema: Schema, sourceId: string, targetId: string) => void;
  afterMoveElement: (schema: Schema) => void;
  beforeRemoveElement: (schema: Schema, targetId: string) => void;
  afterRemoveElement: (schema: Schema) => void;
  beforeSetElementProps: (schema: Schema, targetId: string, props: Record<string, unknown>) => void;
  afterSetElementProps: (nextSchema: Schema) => void;
}

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: [],
  addPlugin: (plugins: Plugin[]) =>
    set((state) => ({
      plugins: [...state.plugins, ...plugins],
    })),
  beforeInsertElement: (schema: Schema, targetId: string, insertElement: InsertElement) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeInsertElement?.(schema, targetId, insertElement);
    });
  },
  afterInsertElement: (schema: Schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterInsertElement?.(schema);
    });
  },
  beforeMoveElement: (schema: Schema, sourceId: string, targetId: string) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeMoveElement?.(schema, sourceId, targetId);
    });
  },
  afterMoveElement: (schema: Schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterMoveElement?.(schema);
    });
  },
  beforeRemoveElement: (schema: Schema, targetId: string) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeRemoveElement?.(schema, targetId);
    });
  },
  afterRemoveElement: (schema: Schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterRemoveElement?.(schema);
    });
  },
  beforeSetElementProps: (schema: Schema, targetId: string, props: Record<string, unknown>) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeSetElementProps?.(schema, targetId, props);
    });
  },
  afterSetElementProps: (nextSchema: Schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterSetElementProps?.(nextSchema);
    });
  },
}));

/**
 * 传入插件 id，即可获取对应的插件的实例
 */
export const usePluginContext = <T extends Plugin>(id: string): T => {
  const plugin = usePluginStore((state) => state.plugins.find((plugin) => plugin.id === id)) as T;
  return plugin;
};
