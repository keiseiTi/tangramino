export type StringValue = {
  type: 'string';
  value: string;
};

export type NumberValue = {
  type: 'number';
  value: number;
};

export type BooleanValue = {
  type: 'boolean';
  value: boolean;
};

export type NullValue = {
  type: 'null';
  value: null;
};

export type ExpressionValue = {
  type: 'expression';
  value: string;
};

export type CodeValue = {
  type: 'code';
  value: string;
};

export type HyperValue =
  | StringValue
  | NumberValue
  | BooleanValue
  | NullValue
  | ExpressionValue
  | CodeValue;
