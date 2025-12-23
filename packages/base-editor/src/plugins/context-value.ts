import type { Engine } from '@tangramino/engine';
import type { EditorPlugin, PluginContext } from '../interface/plugin';
import { definePlugin } from '../utils/define-plugin';

/**
 * 设置上下文值功能到所有元素
 */
const setupContextValues = (engine: Engine) => {
  const elements = engine.elements;

  const setContextValue = (id: string, value: Record<string, unknown>) => {
    const contextValue = engine.getContextValue(id);
    engine.setContextValue(id, {
      ...contextValue,
      ...value,
    });
  };

  Object.keys(elements).forEach((id) => {
    engine.setState({
      [id]: {
        tg_setContextValues: (value: Record<string, unknown>) => {
          setContextValue(id, value);
        },
      },
    });
  });
};

/**
 * 上下文值插件 - 为元素提供设置上下文值的能力
 *
 * @example
 * const plugins = [contextValuePlugin()];
 */
export const contextValuePlugin = definePlugin<EditorPlugin>(() => ({
  id: 'context-value',
  priority: 10,

  onInit(ctx: PluginContext) {
    setupContextValues(ctx.engine);
  },

  onCanvasUpdated(ctx: PluginContext) {
    setupContextValues(ctx.engine);
  },
}));
