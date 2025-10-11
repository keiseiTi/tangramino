export interface FlowSchema {
  flows: Flows;
  bindElements: BindElement[];
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

export type BindElement = {
  id: string;
  event: string;
  flowIds: string[];
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

type FlowExecuteContext = {
  data: unknown;
};

export type LogicExecuteFn = (ctx: FlowExecuteContext) => Promise<unknown> | unknown;

export type LoginFlowNodes = {
  [flowType: string]: LogicExecuteFn;
};
