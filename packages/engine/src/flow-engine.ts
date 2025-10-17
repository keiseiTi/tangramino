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
        const executeFlow = generateExecuteFlow({
          eventNodes,
          logicNodes,
          args,
        });
        run(executeFlow);
      });
    });
  }
};

interface ExecuteFlowProps {
  eventNodes: FlowEventNode[];
  args: unknown[];
  logicNodes?: LogicNodes;
}

function* generateExecuteFlow(props: ExecuteFlowProps) {
  const { eventNodes, logicNodes, args } = props;
  for (let i = 0; i < eventNodes.length; i++) {
    const eventNode = eventNodes[i]!;
    if (eventNode.children.length > 0) {
      run(
        generateExecuteFlow({
          eventNodes: eventNode.children as FlowEventNode[],
          args: args,
          logicNodes: logicNodes || {},
        }),
      );
    } else {
      yield executeFlowNode({
        eventNode,
        logicFlow:
          logicNodes?.[eventNode.type] || ((() => {}) as LogicExecuteFn<Record<string, unknown>>),
      });
    }
  }
}

interface ExecuteFlowNodeProps {
  eventNode: FlowEventNode;
  logicFlow: LogicExecuteFn<Record<string, unknown>>;
}

function executeFlowNode(props: ExecuteFlowNodeProps) {
  const { eventNode, logicFlow } = props;
  logicFlow({
    data: eventNode.props,
  });
}

const run = (executeFlow: Generator<unknown, void, unknown>) => {
  const next = executeFlow.next();
  if (!next.done) {
    run(executeFlow);
  }
};
