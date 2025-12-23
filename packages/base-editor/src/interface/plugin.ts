import type { Schema, InsertElement, Element, Engine } from '@tangramino/engine';
import type { Material } from './material';

/**
 * 插件上下文，提供给插件访问编辑器能力
 */
export interface PluginContext {
  /** 编辑器引擎实例 */
  engine: Engine;
  /** 获取当前 schema */
  getSchema: () => Schema;
  /** 更新 schema */
  setSchema: (schema: Schema) => void;
  /** 获取 materials */
  getMaterials: () => Material[];
  /** 获取其他已加载的插件实例 */
  getPlugin: <T extends EditorPlugin>(id: string) => T | undefined;
}

/**
 * 插件元数据
 */
export interface PluginMeta {
  /** 唯一标识 */
  id: string;
  /** 依赖的其他插件 ID */
  dependencies?: string[];
  /** 优先级，数字越小越先执行，默认 100 */
  priority?: number;
}

/**
 * 插件生命周期钩子
 */
export interface PluginLifecycle {
  /**
   * 插件初始化，在 EditorProvider 挂载时调用
   * 可返回清理函数
   */
  onInit?: (ctx: PluginContext) => (() => void) | void;

  /**
   * 插件销毁，在 EditorProvider 卸载时调用
   */
  onDispose?: (ctx: PluginContext) => void;
}

/**
 * Material 转换钩子（不可变模式）
 */
export interface MaterialHooks {
  /**
   * 转换 materials，必须返回新数组
   * 用于添加默认配置、包装组件等
   */
  transformMaterials?: (materials: Material[]) => Material[];
}

/**
 * Schema 操作钩子
 */
export interface SchemaHooks {
  /** 插入前，返回 false 可取消操作 */
  onBeforeInsert?: (schema: Schema, targetId: string, element: InsertElement) => boolean | void;
  /** 插入后 */
  onAfterInsert?: (schema: Schema, insertedId: string) => void;

  /** 移动前，返回 false 可取消操作 */
  onBeforeMove?: (schema: Schema, sourceId: string, targetId: string) => boolean | void;
  /** 移动后 */
  onAfterMove?: (schema: Schema, movedId: string) => void;

  /** 删除前，返回 false 可取消操作 */
  onBeforeRemove?: (schema: Schema, targetId: string) => boolean | void;
  /** 删除后 */
  onAfterRemove?: (schema: Schema, removedId: string) => void;

  /** 属性更新前，返回 false 可取消操作 */
  onBeforeUpdateProps?: (
    schema: Schema,
    targetId: string,
    props: Record<string, unknown>,
  ) => boolean | void;
  /** 属性更新后 */
  onAfterUpdateProps?: (schema: Schema, targetId: string) => void;
}

/**
 * 编辑器交互钩子
 */
export interface EditorHooks {
  /** 元素被激活/选中时 */
  onElementActivate?: (
    element: Element & { material: Material },
    parentChain: (Element & { material: Material })[],
  ) => void;

  /** 元素取消激活时 */
  onElementDeactivate?: (element: Element) => void;

  /** 画布更新完成时 */
  onCanvasUpdated?: (ctx: PluginContext) => void;
}

/**
 * 编辑态插件完整接口
 */
export interface EditorPlugin
  extends PluginMeta,
    PluginLifecycle,
    MaterialHooks,
    SchemaHooks,
    EditorHooks {}

/**
 * 插件工厂函数类型
 */
export type EditorPluginFactory<T extends EditorPlugin = EditorPlugin, Options = void> =
  Options extends void ? () => T : (options: Options) => T;
