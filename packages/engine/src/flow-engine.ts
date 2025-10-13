import { parseFlow } from './';
import type { Engine, Schema, LoginFlowNodes, FlowEvent } from './';

interface FlowEngineProps {
  engine: Engine;
  schema: Schema;
  loginFlowNodes?: LoginFlowNodes;
}

interface ExecuteFlowProps {
  flowEvent: FlowEvent;
  args: unknown[];
  loginFlowNodes?: LoginFlowNodes;
}

export const withFlowEngine = ({ engine, schema, loginFlowNodes = {} }: FlowEngineProps) => {
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
          loginFlowNodes,
        });
      });
    });
  }
};

const executeFlow = (props: ExecuteFlowProps) => {
  console.log('keiseiTi :>> ', 'props',  props);
  // TODO
};
