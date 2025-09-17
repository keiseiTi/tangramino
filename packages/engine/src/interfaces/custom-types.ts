export type State = {
  [key: string]: Record<string, unknown>;
};

export type LayoutNode = {
  id: string;
  children?: LayoutNode[];
};

export type LayoutTree = LayoutNode[];

export interface InsertElement {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  hidden?: boolean;
}

export type ContextValue = {
  [key: string]: unknown;
};

export interface ContextValues {
  [key: string]: ContextValue;
}
