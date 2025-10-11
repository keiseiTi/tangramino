import { parseFlow } from './';
import type { Engine, Schema, LoginFlowNodes } from './';

interface FlowEngineProps {
  engine: Engine;
  schema: Schema;
  loginFlowNodes: LoginFlowNodes;
}

export const withFlowEngine = ({ engine, schema }: FlowEngineProps) => {
  const { flows, bindElements } = schema;
  if (flows && bindElements) {
    const flowEvents = parseFlow({
      flows,
      bindElements,
    });

    flowEvents.forEach((flowEvent) => {
      const { elementId, eventName } = flowEvent;

      engine.injectCallback(elementId, eventName, (...args: unknown[]) => {
        console.log('keiseiTi :>> ', 'args', args);
        // TODO
      });
    });
  }
};
