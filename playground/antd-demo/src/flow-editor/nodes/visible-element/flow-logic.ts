import { executeHyperValue } from '@/utils/execute';
import type { BooleanValue, CodeValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface VisibleElementNodeProps {
  elementIds: string[];
  value: CodeValue | BooleanValue;
}

// 设置元素的可见性，true 为可见，false 为隐藏
export const visibleElement = (props: FlowExecuteContext<VisibleElementNodeProps>) => {
  const { engine, data } = props;
  const { value, elementIds } = data;
  const visible = executeHyperValue(value);
  if (Array.isArray(elementIds)) {
    if (visible === false) {
      engine.hiddenElements(elementIds);
    } else {
      engine.showElements(elementIds);
    }
  }
};
