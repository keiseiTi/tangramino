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
      case 'function':
        const { params, body } = hyperValue.value || {};
        const filterParams = params?.filter((param) => param.name && param.value) || [];
        const funValue: unknown[] = [];
        params?.forEach((param) => {
          const [paramType, arg1, arg2] = param.value?.split('.') || [];
          if (paramType === 'state' && arg1 && arg2 && param.name) {
            const state = engine.getState(arg1) || {};
            funValue.push(state[arg2]);
          } else if (paramType === 'method') {
            // TODO
          } else if (paramType === 'global' && arg1) {
            const argValue = engine.getGlobalVariable(arg1);
            funValue.push(argValue);
          }
        });

        const args = filterParams.map((param) => param.name) as string[];
        return new Function(...args, body || '')(...funValue);
    }
  }
};
