import type {
  Schema,
  Elements,
  Layout,
  LayoutTree,
  LogicFlow,
  FlowEvent,
  FlowEvenNode,
  FlowNode,
} from '../';

export const parse = (schema: Schema) => {
  const { elements, layout, extensions, logicFlow } = schema;

  const _element = parseElement(elements);
  const _layout = parseLayout(layout);
  return {
    elements: _element,
    layout: _layout,
    extensions,
    logicFlow,
  };
};

const parseElement = (elements: Elements): Elements => {
  const _elements: Elements = {};
  Object.keys(elements).forEach((id) => {
    const element = elements[id];
    if (element) {
      const { type, props, hidden } = element;
      _elements[id] = {
        type,
        props: props || {},
        hidden: hidden || false,
      };
    }
  });
  return _elements;
};

const parseLayout = (layout: Layout) => {
  const { root, structure } = layout;
  const childrenTree = recursionLayout(structure, root);

  return [
    {
      id: root,
      children: childrenTree,
    },
  ];
};

const recursionLayout = (structure: Layout['structure'], node: string): LayoutTree => {
  const nodes = structure[node];

  return (nodes || []).map((node: string) => {
    if (Array.isArray(structure[node])) {
      return {
        id: node,
        children: recursionLayout(structure, node),
      };
    }
    return {
      id: node,
    };
  });
};

const recursionFlowNodes = (
  nodeId: string,
  nodes: {
    [nodeId: string]: FlowNode;
  },
  eventNode?: FlowEvenNode,
) => {
  const node = nodes[nodeId]!;
  const { id, type, props, next } = node;
  const newEventNode: FlowEvenNode = {
    id,
    type,
    props,
    children: [],
  };
  next.forEach((nextId) => {
    const node = recursionFlowNodes(nextId, nodes, newEventNode);
    if (eventNode) {
      eventNode.children.push(node);
    }
  });
  return newEventNode;
};

export const parseFlow = (logicFlow: LogicFlow): FlowEvent[] => {
  const { flows, bindElements } = logicFlow;
  const result: FlowEvent[] = [];
  bindElements?.forEach((bindElement) => {
    const { id, event, flowIds } = bindElement;
    const flowEvent: FlowEvent = {
      elementId: id,
      eventName: event,
      eventNodes: [],
    };
    const eventNodes: FlowEvenNode[] = [];
    flowIds?.forEach((flowId) => {
      const flow = flows[flowId];
      if (flow) {
        const node = recursionFlowNodes(flow.startId, flow.nodes);
        eventNodes.push(node);
      }
    });
    flowEvent.eventNodes = eventNodes;
    result.push(flowEvent);
  });
  return result;
};
