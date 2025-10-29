import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

export const executeHyperValue = <T>(ctx: FlowExecuteContext<T>, hyperValue?: HyperValue) => {
  if (hyperValue) {
    switch (hyperValue.type) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'null':
        return hyperValue.value;
      case 'expression':
      case 'code':
        return new Function(hyperValue.value || '')();
    }
  }
};
