import { parseFlow } from './';
import type { Engine, Schema } from './';

export const withFlowEngine = (engine: Engine, schema: Schema) => {
  const { logicFlow } = schema;
  if (logicFlow) {
    const FlowEvents = parseFlow(logicFlow);

    FlowEvents.forEach((flowEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { elementId, eventName, eventNodes } = flowEvent;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      engine.injectCallback(elementId, eventName, (...args: unknown[]) => {
        // TODO
      });
    });
  }
};
