import type { EditorPlugin, PluginContext, SchemaHooks, EditorHooks } from '../interface/plugin';
import type { Material } from '../interface/material';

/**
 * PluginManager 管理编辑态插件的注册、生命周期和钩子调用
 */
export class PluginManager {
  private plugins: Map<string, EditorPlugin> = new Map();
  private cleanupFns: Map<string, () => void> = new Map();
  private ctx: PluginContext;
  private initialized = false;

  constructor(ctx: PluginContext) {
    this.ctx = ctx;
  }

  get context(): PluginContext {
    return this.ctx;
  }

  /**
   * 注册插件，自动处理依赖排序
   */
  register(plugins: EditorPlugin[]): void {
    if (plugins.length > 0) {
      this.validatePlugins(plugins);
      const sorted = this.sortByDependencies(plugins);
      for (const plugin of sorted) {
        this.plugins.set(plugin.id, plugin);
      }
    }
  }

  /**
   * 初始化所有已注册插件
   */
  init(): void {
    if (this.initialized) return;

    for (const [id, plugin] of this.plugins) {
      try {
        const cleanup = plugin.onInit?.(this.ctx);
        if (typeof cleanup === 'function') {
          this.cleanupFns.set(id, cleanup);
        }
      } catch (error) {
        console.error(`[PluginManager] Failed to init plugin "${id}":`, error);
      }
    }

    this.initialized = true;
  }

  /**
   * 销毁所有插件
   */
  dispose(): void {
    // 逆序销毁
    const ids = [...this.plugins.keys()].reverse();

    for (const id of ids) {
      try {
        const plugin = this.plugins.get(id)!;
        plugin.onDispose?.(this.ctx);
        this.cleanupFns.get(id)?.();
      } catch (error) {
        console.error(`[PluginManager] Failed to dispose plugin "${id}":`, error);
      }
    }

    this.plugins.clear();
    this.cleanupFns.clear();
    this.initialized = false;
  }

  /**
   * 获取插件实例
   */
  getPlugin<T extends EditorPlugin>(id: string): T | undefined {
    return this.plugins.get(id) as T | undefined;
  }

  /**
   * 转换 materials（链式调用所有插件）
   */
  transformMaterials(materials: Material[]): Material[] {
    let result = materials;

    for (const plugin of this.plugins.values()) {
      if (plugin.transformMaterials) {
        result = plugin.transformMaterials(result);
      }
    }

    return result;
  }

  /**
   * 调用 schema 钩子
   * 返回 false 表示操作被取消
   */
  callSchemaHook<K extends keyof SchemaHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<SchemaHooks[K]>>
  ): boolean {
    for (const plugin of this.plugins.values()) {
      const hook = plugin[hookName] as ((...args: unknown[]) => boolean | void) | undefined;
      if (hook) {
        try {
          const result = hook.apply(plugin, args);
          if (result === false) {
            return false; // 取消操作
          }
        } catch (error) {
          console.error(`[PluginManager] Error in ${String(hookName)} of plugin "${plugin.id}":`, error);
        }
      }
    }
    return true;
  }

  /**
   * 调用编辑器钩子
   */
  callEditorHook<K extends keyof EditorHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<EditorHooks[K]>>
  ): void {
    for (const plugin of this.plugins.values()) {
      const hook = plugin[hookName] as ((...args: unknown[]) => void) | undefined;
      if (hook) {
        try {
          hook.apply(plugin, args);
        } catch (error) {
          console.error(`[PluginManager] Error in ${String(hookName)} of plugin "${plugin.id}":`, error);
        }
      }
    }
  }

  /**
   * 获取所有插件列表
   */
  getAllPlugins(): EditorPlugin[] {
    return [...this.plugins.values()];
  }

  // === 私有方法 ===

  /**
   * 验证插件
   */
  private validatePlugins(plugins: EditorPlugin[]): void {
    const ids = new Set<string>();

    for (const plugin of plugins) {
      if (!plugin.id) {
        throw new Error('[PluginManager] Plugin must have an id');
      }
      if (ids.has(plugin.id)) {
        throw new Error(`[PluginManager] Duplicate plugin id: ${plugin.id}`);
      }
      ids.add(plugin.id);
    }

    // 验证依赖存在
    for (const plugin of plugins) {
      for (const depId of plugin.dependencies || []) {
        if (!ids.has(depId)) {
          throw new Error(
            `[PluginManager] Plugin "${plugin.id}" depends on "${depId}" which is not registered`,
          );
        }
      }
    }
  }

  /**
   * 按依赖关系排序插件
   */
  private sortByDependencies(plugins: EditorPlugin[]): EditorPlugin[] {
    // 先按 priority 排序
    const sorted = [...plugins].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

    // 拓扑排序处理依赖
    const result: EditorPlugin[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const pluginMap = new Map(sorted.map((p) => [p.id, p]));

    const visit = (id: string) => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        throw new Error(`[PluginManager] Circular dependency detected involving plugin "${id}"`);
      }

      visiting.add(id);
      const plugin = pluginMap.get(id)!;

      for (const depId of plugin.dependencies || []) {
        visit(depId);
      }

      visiting.delete(id);
      visited.add(id);
      result.push(plugin);
    };

    for (const plugin of sorted) {
      visit(plugin.id);
    }

    return result;
  }
}
