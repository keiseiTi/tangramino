import type { Engine } from '@tangramino/engine';
import type { EditorPlugin, PluginContext } from '../interface/plugin';
import { definePlugin } from '../utils/define-plugin';

/**
 * 应用模式到所有元素
 */
const applyMode = (engine: Engine, mode: 'edit' | 'render') => {
  const elements = engine.elements;
  Object.keys(elements).forEach((id) => {
    engine.setState({
      [id]: { tg_mode: mode },
    });
  });
};

/**
 * 模式插件 - 设置所有元素的编辑/渲染模式
 *
 * @example
 * const plugins = [modePlugin('edit')];
 */
export const modePlugin = definePlugin<EditorPlugin, 'edit' | 'render'>((mode: 'edit' | 'render') => ({
  id: 'mode',
  priority: 0, // 最先执行

  onInit(ctx: PluginContext) {
    applyMode(ctx.engine, mode);
  },

  onCanvasUpdated(ctx: PluginContext) {
    // schema 变化后重新应用 mode
    applyMode(ctx.engine, mode);
  },
}));
