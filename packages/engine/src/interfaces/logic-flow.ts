export interface LogicFlowSchema {
  logicFlow?: LogicFlow;
}

export type LogicFlow = {
  flows: Flows;
  bindElements: BindElement[];
};

export type Flows = {
  [flowId: string]: {
    startId: string;
    nodes: { [nodeId: string]: FlowNode };
  };
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

export type FlowEvenNode = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: FlowEvenNode[];
};

export type FlowEvent = {
  elementId: string;
  eventName: string;
  eventNodes: FlowEvenNode[];
};
