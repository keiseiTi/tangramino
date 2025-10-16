import { parseFlow } from './';
import type { Engine, Schema, LogicNodes, FlowEvent } from './';

interface FlowEngineProps {
  engine: Engine;
  schema: Schema;
  logicNodes?: LogicNodes;
}

interface ExecuteFlowProps {
  flowEvent: FlowEvent;
  args: unknown[];
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
      const { elementId, eventName } = flowEvent;
      engine!.injectCallback(elementId, eventName, (...args: unknown[]) => {
        executeFlow({
          flowEvent,
          args,
          logicNodes,
        });
      });
    });
  }
};

const executeFlow = (props: ExecuteFlowProps) => {
  console.log('keiseiTi :>> ', 'props', props);
  // TODO
};
