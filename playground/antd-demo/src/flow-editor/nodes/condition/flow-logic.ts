import { executeHyperValue } from '@/utils/execute';
import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

type Condition = {
  value: boolean;
  nextNode: string;
};

interface ConditionNodeProps {
  condition: Condition[];
  judgment: HyperValue;
}

export const condition = (ctx: FlowExecuteContext<ConditionNodeProps>) => {
  const { data } = ctx;
  const { judgment } = data;
  return executeHyperValue(ctx, judgment);
};
