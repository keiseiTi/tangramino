import { executeHyperValue } from '@/utils/execute';
import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface EmitElementActionProps {}

export const emitElementAction = (ctx: FlowExecuteContext<EmitElementActionProps>) => {
  const { data } = ctx;
};
