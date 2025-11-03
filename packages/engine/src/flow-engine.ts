import { parseFlow } from './';
import type { Engine, Schema, LogicNodes, FlowEventNode, LogicExecuteFn } from './';

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
      engine!.injectCallback(elementId, eventName, (...args: unknown[]) => {
        // let returnValueMap: Record<string, unknown> = {};
        const generator = generateExecuteFlow({
          engine,
          eventNodes,
          logicNodes,
          args,
          // returnValueMap,
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
  // returnValueMap: Record<string, unknown>;
}

function* generateExecuteFlow(options: ExecuteFlowOptions): Generator<unknown, void, unknown> {
  const { eventNodes, logicNodes, args, engine } = options;
  for (let i = 0; i < eventNodes.length; i++) {
    const eventNode = eventNodes[i]!;
    const logicFlow =
      logicNodes?.[eventNode.type] || ((() => {}) as LogicExecuteFn<Record<string, unknown>>);
    yield executeFlowNode({
      engine,
      eventNode,
      logicFlow,
      // returnValueMap,
    });
    if (eventNode.children.length > 0) {
      yield* generateExecuteFlow({
        engine,
        eventNodes: eventNode.children as FlowEventNode[],
        args: args,
        logicNodes: logicNodes || {},
      });
    }
  }
}

interface ExecuteFlowNodeOptions {
  eventNode: FlowEventNode;
  logicFlow: LogicExecuteFn<Record<string, unknown>>;
  engine: Engine;
}

function executeFlowNode(options: ExecuteFlowNodeOptions) {
  const { eventNode, logicFlow, engine } = options;
  const ctx = {
    engine,
    data: eventNode.props,
  };
  logicFlow(ctx);
}

const run = (executeFlow: Generator<unknown, void, unknown>) => {
  const next = executeFlow.next();
  console.log(next);
  if (!next.done) {
    run(executeFlow);
  }
};
