import type { Engine } from '@tangramino/engine';
import type { Plugin } from './plugin';

/**
 * 设置渲染模式的插件
 * 为所有元素添加 tg_mode: 'render' 状态
 */
export const renderModePlugin: Plugin = (engine: Engine) => {
  const elements = engine.elements;
  Object.keys(elements).forEach((id) => {
    engine.setState({
      [id]: { tg_mode: 'render' },
    });
  });
};

/**
 * 上下文值插件
 * 为所有元素添加 tg_setContextValues 方法
 */
export const contextValuePlugin: Plugin = (engine: Engine) => {
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
 * 默认渲染插件集合
 * 包含渲染模式和上下文值功能
 */
export const defaultRenderPlugins: Plugin[] = [
  renderModePlugin,
  contextValuePlugin,
];
