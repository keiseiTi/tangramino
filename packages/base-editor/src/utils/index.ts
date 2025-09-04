import { nanoid } from 'nanoid';

export const uniqueId = (prefix?: string) =>
  prefix ? prefix + '-' + nanoid(8) : nanoid(16);
