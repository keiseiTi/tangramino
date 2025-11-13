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
};

export type Elements = {
  [key: string]: ElementState;
};

export type Layout = {
  root: string;
  structure: { [key: string]: string[] };
};

export type Import = {
  name: string;
  description: string;
  version: string;
  semverTag: 'lock' | 'patch' | 'minor' | 'major';
};

export type GlobalVariable = {
  name: string;
  description?: string;
};

export interface Schema extends FlowSchema {
  elements: Elements;
  layout: Layout;
  imports?: Import[];
  context?: {
    globalVariables?: GlobalVariable[];
  };
  extensions: Record<string, unknown>;
}
