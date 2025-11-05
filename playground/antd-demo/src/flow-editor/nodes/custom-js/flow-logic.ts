import { executeHyperValue } from '@/utils/execute';
import type { CodeValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface CustomJSNodeProps {
  code: CodeValue;
}

export const customJS = (ctx: FlowExecuteContext<CustomJSNodeProps>) => {
  const { data } = ctx;
  const { code } = data;
  return executeHyperValue(ctx, code);
};
