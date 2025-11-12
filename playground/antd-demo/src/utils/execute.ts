import type { HyperValue } from '@/interfaces/hyper-value';
import type { FlowExecuteContext } from '@tangramino/engine';

export const executeHyperValue = <T>(ctx: FlowExecuteContext<T>, hyperValue?: HyperValue) => {
  if (hyperValue) {
    const { engine } = ctx;
    switch (hyperValue.type) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'null':
        return hyperValue.value;
      case 'contextValue':
        const [elementId, elementProp] = hyperValue.value?.split('.') || [];
        const state = engine.getState(elementId) || {};
        return state[elementProp];
      case 'expression':
        return new Function('return ' + hyperValue.value || '')();
      case 'code':
        return new Function(hyperValue.value || '')();
    }
  }
};
