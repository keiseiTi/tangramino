import type { HyperValue } from '@/interfaces/hyper-value';

export const executeHyperValue = (hyperValue?: HyperValue) => {
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
