import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface SetElementPropsNodeProps {
  setter?: {
    elementId: string;
    propName?: string;
    value?: HyperValue;
  };
}

// 设置元素的可见性，true 为可见，false 为隐藏
export const setElementProps = (props: FlowExecuteContext<SetElementPropsNodeProps>) => {
  const { engine, data } = props;
  const { setter} = data;
};
