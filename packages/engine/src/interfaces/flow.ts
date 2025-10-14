export interface FlowSchema {
  flows?: Flows;
  bindElements?: BindElements;
}

export type Flows = {
  [flowId: string]: Flow;
};

export type Flow = {
  startId: string;
  nodes: { [nodeId: string]: FlowNode };
};

export type FlowNode = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  prev: string[];
  next: string[];
};

type BindElementKey = `${string}::${string}`;

export type BindElements = {
  [key: BindElementKey]: string
};

export type FlowEventNode = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: FlowEventNode[];
};

export type FlowEvent = {
  elementId: string;
  eventName: string;
  eventNodes: FlowEventNode[];
};

export type FlowExecuteContext<T> = {
  data: T;
};

export type LogicExecuteFn<T> = (ctx: FlowExecuteContext<T>) => Promise<unknown> | unknown;

export type LoginFlowNodes<T extends Record<string, unknown> = Record<string, unknown>> = {
  [flowType: string]: LogicExecuteFn<T>;
};
