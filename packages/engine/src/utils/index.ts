import { produce } from 'immer';

export * from './parse';
export * from './schema-utils';

export const producer = <T>(_: T): T => {
  return produce(_, (draft) => draft);
};

export const isPromise = (value: unknown) => {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof (value as Promise<unknown>).then === 'function'
  );
};
