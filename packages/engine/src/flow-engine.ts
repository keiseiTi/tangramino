import { parseFlow } from './';
import type { Engine, Schema } from './';

export const withFlowEngine = (engine: Engine, schema: Schema) => {
  const { logicFlow } = schema;
  if (logicFlow) {
    parseFlow(logicFlow);
    // const flowEngine = createFlowEngine(flows, bindElements);
    // engine.flowEngine = flowEngine;
  }
};
