import type { FlowSchema } from './flow';

export type ElementState = {
  type: string;
  props: { [key: string]: unknown };
  hidden?: boolean;
};

export type Element = {
  id: string;
  type: string;
  props: { [key: string]: unknown };
}

export type Elements = {
  [key: string]: ElementState;
};

export type Layout = {
  root: string;
  structure: { [key: string]: string[] };
};

export interface Schema extends FlowSchema {
  elements: Elements;
  layout: Layout;
  extensions: Record<string, unknown>;
}
