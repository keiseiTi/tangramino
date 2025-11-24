import { create } from 'zustand';
import type { Plugin } from '../interface/plugin';

type TransformSchemaForPlugin = Required<Plugin['transformSchema']>;

type EditorContextForPlugin = Required<Plugin['editorContext']>;

export type PluginCore = TransformSchemaForPlugin &
  EditorContextForPlugin & {
    plugins: Plugin[];
    addPlugin: (plugins: Plugin[]) => void;
  };

export const usePluginCore = create<PluginCore>((set, get) => ({
  plugins: [],
  addPlugin: (plugins) =>
    set((state) => ({
      plugins: [...state.plugins, ...plugins],
    })),
  beforeInsertElement: (schema, targetId, insertElement) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeInsertElement?.(schema, targetId, insertElement);
    });
  },
  afterInsertElement: (schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterInsertElement?.(schema);
    });
  },
  beforeMoveElement: (schema, sourceId, targetId) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeMoveElement?.(schema, sourceId, targetId);
    });
  },
  afterMoveElement: (schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterMoveElement?.(schema);
    });
  },
  beforeRemoveElement: (schema, targetId) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeRemoveElement?.(schema, targetId);
    });
  },
  afterRemoveElement: (schema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterRemoveElement?.(schema);
    });
  },
  beforeSetElementProps: (schema, targetId, props) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.beforeSetElementProps?.(schema, targetId, props);
    });
  },
  afterSetElementProps: (nextSchema) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.transformSchema?.afterSetElementProps?.(nextSchema);
    });
  },
  beforeInitMaterials: (materials) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.editorContext?.beforeInitMaterials?.(materials);
    });
  },
  afterInsertMaterial: (sourceMaterial, targetElement) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.editorContext?.afterInsertMaterial?.(sourceMaterial, targetElement);
    });
  },
  activateElement: (element, parentElements) => {
    const plugins = get().plugins;
    plugins.forEach((plugin) => {
      plugin.editorContext?.activateElement?.(element, parentElements);
    });
  },
}));

/**
 * 传入插件 id，即可获取对应的插件的实例
 */
export const usePluginContext = <T extends Plugin>(id: string): T => {
  const plugin = usePluginCore((state) => state.plugins.find((plugin) => plugin.id === id)) as T;
  return plugin;
};
