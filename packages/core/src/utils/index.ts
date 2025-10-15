import { nanoid } from 'nanoid';

export const uniqueId = (prefix?: string, len?: number) =>
  prefix ? prefix + '-' + nanoid(len || 8) : nanoid(len || 16);
