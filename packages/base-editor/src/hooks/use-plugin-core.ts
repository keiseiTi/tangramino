import { create } from 'zustand';
import { PluginManager } from '../plugins/plugin-manager';
import type { EditorPlugin, PluginContext, SchemaHooks, EditorHooks } from '../interface/plugin';
import type { Material } from '../interface/material';

/**
 * 插件核心 Hook：仅管理插件列表和 PluginManager 实例
 */
export interface PluginCore {
  plugins: EditorPlugin[];
  pluginManager: PluginManager | null;

  addPlugins: (plugins: EditorPlugin[]) => void;
  removePlugins: () => void;
  initPluginManager: (ctx: PluginContext) => void;
  disposePluginManager: () => void;

  // 核心方法
  transformMaterials: (materials: Material[]) => Material[];

  // 直接暴露钩子调用接口（最新 API）
  callSchemaHook: <K extends keyof SchemaHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<SchemaHooks[K]>>
  ) => boolean;

  callEditorHook: <K extends keyof EditorHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<EditorHooks[K]>>
  ) => void;
}

export const usePluginCore = create<PluginCore>((set, get) => ({
  plugins: [],
  pluginManager: null,

  addPlugins: (plugins) =>
    set((state) => ({
      plugins: [...state.plugins, ...plugins],
    })),

  removePlugins: () => {
    set(() => ({
      plugins: [],
    }));
  },

  initPluginManager: (ctx: PluginContext) => {
    const plugins = get().plugins;
    const pm = new PluginManager(ctx);

    try {
      pm.register(plugins);
      pm.init();
      set({ pluginManager: pm });
    } catch (error) {
      console.error('[usePluginCore] Failed to initialize PluginManager:', error);
    }
  },

  disposePluginManager: () => {
    const pm = get().pluginManager;
    if (pm) {
      pm.dispose();
      set({ pluginManager: null });
    }
  },

  transformMaterials: (materials: Material[]): Material[] => {
    const pm = get().pluginManager;
    if (pm) {
      return pm.transformMaterials(materials);
    }
    return materials;
  },

  callSchemaHook: (hookName, ...args) => {
    const pm = get().pluginManager;
    if (pm) {
      return pm.callSchemaHook(hookName, ...args);
    }
    return true;
  },

  callEditorHook: (hookName, ...args) => {
    const pm = get().pluginManager;
    if (pm) {
      pm.callEditorHook(hookName, ...args);
    }
  },
}));

/**
 * 获取插件实例
 */
export const usePluginContext = <T extends EditorPlugin>(id: string): T | undefined => {
  const pm = usePluginCore.getState().pluginManager;
  if (!pm) return undefined;
  return pm.getPlugin<T>(id);
};
