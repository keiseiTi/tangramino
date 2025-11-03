import { executeHyperValue } from '@/utils/execute';
import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface SetElementPropsNodeProps {
  setters?: {
    elementId: string;
    propName?: string;
    value?: HyperValue;
  }[];
}

// 设置元素的可见性，true 为可见，false 为隐藏
export const setElementProps = (ctx: FlowExecuteContext<SetElementPropsNodeProps>) => {
  const { engine, data } = ctx;
  const { setters } = data;
  setters?.forEach((setter) => {
    const { elementId, propName, value } = setter;
    if (elementId && propName)
      engine.setState({
        [elementId]: {
          [propName]: executeHyperValue(ctx, value),
        },
      });
  });
};
