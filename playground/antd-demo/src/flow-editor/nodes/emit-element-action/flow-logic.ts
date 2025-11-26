import { executeHyperValue } from '@/utils/execute';
import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface EmitElementActionProps {
  setters?: {
    elementId: string;
    methodName?: string;
    value?: HyperValue;
  }[];
}

export const emitElementAction = (ctx: FlowExecuteContext<EmitElementActionProps>) => {
  const { engine, data } = ctx;
  const { setters } = data;
  setters?.forEach((setter) => {
    const { elementId, methodName, value } = setter;
    if (elementId && methodName) {
      const contextValue = engine.getContextValue(elementId);
      const method = contextValue?.[methodName] as (...args: unknown[]) => void;
      if (method) {
        method(executeHyperValue(ctx, value));
      }
    }
  });
};
