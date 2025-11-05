import type { Engine } from './engine';

export interface FlowSchema {
  flows?: Flows;
  bindElements?: BindElement[];
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
  flowId: string;
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
  /**
   * 事件节点的属性值
   */
  data: T;
  /**
   * 逻辑流引擎
   */
  engine: Engine;
  /**
   * 之前的事件节点的返回值
   */
  lastReturnedVal?: Record<string, unknown>;
};

export type LogicExecuteFn<T> = (ctx: FlowExecuteContext<T>) => Promise<unknown> | unknown;

export type LogicNodes<T extends Record<string, unknown> = Record<string, unknown>> = {
  [flowType: string]: LogicExecuteFn<T>;
};
