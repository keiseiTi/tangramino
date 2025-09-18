import { parseFlow } from './';
import type { Engine, Schema } from './';

export const withFlowEngine = (engine: Engine, schema: Schema) => {
  const { logicFlow } = schema;
  if (logicFlow) {
    const flowEvents = parseFlow(logicFlow);

    flowEvents.forEach((flowEvent) => {
      const { elementId, eventName } = flowEvent;

      engine.injectCallback(elementId, eventName, (...args: unknown[]) => {
        console.log('keiseiTi :>> ', 'args', args);
        // TODO
      });
    });
  }
};
