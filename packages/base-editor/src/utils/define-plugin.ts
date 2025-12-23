import type { EditorPlugin } from '../interface/plugin';

/**
 * 插件工厂函数类型
 */
export type EditorPluginFactory<
  T extends EditorPlugin = EditorPlugin,
  Options = void,
> = Options extends void ? () => T : (options: Options) => T;

/**
 * 创建类型安全的编辑态插件
 *
 * @example
 * // 无参数插件
 * const myPlugin = definePlugin(() => ({
 *   id: 'my-plugin',
 *   onInit(ctx) {
 *     console.log('Plugin initialized');
 *   },
 * }));
 *
 * @example
 * // 带参数插件
 * const configPlugin = definePlugin<EditorPlugin, { debug: boolean }>((options) => ({
 *   id: 'config-plugin',
 *   onInit(ctx) {
 *     if (options.debug) console.log('Debug mode');
 *   },
 * }));
 *
 * @param factory 插件工厂函数
 */
export function definePlugin<T extends EditorPlugin, Options = void>(
  factory: Options extends void ? () => T : (options: Options) => T,
): EditorPluginFactory<T, Options> {
  return factory as EditorPluginFactory<T, Options>;
}
