import type { LogicFlowSchema } from './logic-flow';

export type ElementState = {
  type: string;
  props: { [key: string]: unknown };
  hidden?: boolean;
};

export type Elements = {
  [key: string]: ElementState;
};

export type Layout = {
  root: string;
  structure: { [key: string]: string[] };
};

export interface Schema extends LogicFlowSchema {
  elements: Elements;
  layout: Layout;
  extensions: Record<string, unknown>;
}
