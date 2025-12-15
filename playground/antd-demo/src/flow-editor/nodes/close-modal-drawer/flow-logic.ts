import type { FlowExecuteContext } from '@tangramino/engine';

interface CloseModalDrawerNodeProps {
  elementId: string;
}

export const closeModalDrawer = (ctx: FlowExecuteContext<CloseModalDrawerNodeProps>) => {
  const { engine, data } = ctx;
  const { elementId } = data;

  if (!elementId) {
    console.warn('未指定要关闭的弹窗或抽屉元素 ID');
    return;
  }

  const element = engine.elements[elementId];
  if (!element) {
    console.warn(`未找到元素: ${elementId}`);
    return;
  }

  engine.setState({
    [elementId]: {
      open: false,
    },
  });
};
