import { executeHyperValue } from '@/utils/execute';
import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

interface SetGlobalVariableNodeProps {
  setters?: { name: string; value: HyperValue }[];
}

export const setGlobalVariable = (ctx: FlowExecuteContext<SetGlobalVariableNodeProps>) => {
  const { data, engine } = ctx;
  const { setters } = data;
  if (setters) {
    setters.forEach(({ name, value }) => {
      const [namespace, varName] = name.split('.');
      if (namespace && varName) {
        engine.setGlobalVariable(varName, executeHyperValue(ctx, value));
      }
    });
  }
};
