import type { CodeValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';
interface CustomJSNodeProps {
  code: CodeValue;
}

export const customJS = (props: FlowExecuteContext<CustomJSNodeProps>) => {
  const { data } = props;
  const { code } = data;
  return new Function(code.value || '')();
};
