import { parseFlow } from './';
import type { Engine, Schema, LogicNodes, FlowEventNode, LogicExecuteFn } from './';
import { isPromise } from './utils';

interface FlowEngineProps {
  engine: Engine;
  schema: Schema;
  logicNodes?: LogicNodes;
}

export const withFlowEngine = ({ engine, schema, logicNodes = {} }: FlowEngineProps) => {
  const { flows, bindElements } = schema;
  if (flows && bindElements) {
    const flowEvents = parseFlow({
      flows,
      bindElements,
    });

    flowEvents.forEach((flowEvent) => {
      const { elementId, eventName, eventNodes } = flowEvent;
      engine.injectCallback(elementId, eventName, (...args: unknown[]) => {
        const returnValMap: Record<string, unknown> = {};
        const generator = generateExecuteFlow({
          engine,
          eventNodes,
          logicNodes,
          args,
          returnValMap,
        });
        run(generator);
      });
    });
  }
};

interface ExecuteFlowOptions {
  eventNodes: FlowEventNode[];
  args: unknown[];
  logicNodes?: LogicNodes;
  engine: Engine;
  returnValMap: Record<string, unknown>;
}

function* generateExecuteFlow(options: ExecuteFlowOptions): Generator<unknown, void, unknown> {
  const { eventNodes, logicNodes, args, engine, returnValMap } = options;
  for (let i = 0; i < eventNodes.length; i++) {
    const eventNode = eventNodes[i]!;
    const eventNodeChildren = eventNode.children || [];
    const logicFlow =
      logicNodes?.[eventNode.type] || ((() => {}) as LogicExecuteFn<Record<string, unknown>>);
    const returnVal = yield executeFlowNode({
      engine,
      eventNode,
      logicFlow,
      returnValMap,
    });
    returnValMap[eventNode.id] = returnVal;
    if (eventNode.type === 'condition') {
      const conditionItem = (
        eventNode.props?.['condition'] as { value: boolean; nextNode: string }[]
      )?.find?.((item) => item.value === returnVal);
      const nextNode = eventNodeChildren.find((item) => item.id === conditionItem?.nextNode);
      yield* generateExecuteFlow({
        engine,
        eventNodes: nextNode ? [nextNode] : [],
        args: args,
        logicNodes: logicNodes || {},
        returnValMap,
      });
    } else {
      yield* generateExecuteFlow({
        engine,
        eventNodes: eventNode.children as FlowEventNode[],
        args: args,
        logicNodes: logicNodes || {},
        returnValMap,
      });
    }
  }
}

interface ExecuteFlowNodeOptions {
  eventNode: FlowEventNode;
  logicFlow: LogicExecuteFn<Record<string, unknown>>;
  engine: Engine;
  returnValMap: Record<string, unknown>;
}

function executeFlowNode(options: ExecuteFlowNodeOptions) {
  const { eventNode, logicFlow, engine, returnValMap } = options;
  const ctx = {
    engine,
    data: eventNode.props,
    lastReturnedVal: returnValMap,
  };
  const returnVal = logicFlow(ctx);
  return returnVal;
}

const run = (executeFlow: Generator<unknown, void, unknown>, lastValue?: unknown) => {
  const next = executeFlow.next(lastValue);
  if (!next.done) {
    if (isPromise(next.value)) {
      (next.value as Promise<unknown>).then((res) => run(executeFlow, res));
    } else {
      run(executeFlow, next.value);
    }
  }
};
