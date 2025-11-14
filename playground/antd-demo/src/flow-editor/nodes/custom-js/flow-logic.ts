import { executeHyperValue } from '@/utils/execute';
import type { FunctionValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface CustomJSNodeProps {
  value: FunctionValue;
}

export const customJS = (ctx: FlowExecuteContext<CustomJSNodeProps>) => {
  const { data } = ctx;
  const { value } = data;
  return executeHyperValue(ctx, value);
};
