import type { FlowExecuteContext } from '@tangramino/engine';

interface OpenModalDrawerNodeProps {
  elementId: string;
}

export const openModalDrawer = (ctx: FlowExecuteContext<OpenModalDrawerNodeProps>) => {
  const { engine, data } = ctx;
  const { elementId } = data;

  if (!elementId) {
    console.warn('未指定要打开的弹窗或抽屉元素 ID');
    return;
  }

  const element = engine.elements[elementId];
  if (!element) {
    console.warn(`未找到元素: ${elementId}`);
    return;
  }

  if (element.type !== 'modal' && element.type !== 'drawer') {
    console.warn(`元素类型必须是 modal 或 drawer，当前类型: ${element.type}`);
    return;
  }

  engine.setState({
    [elementId]: {
      open: true,
    },
  });
};
