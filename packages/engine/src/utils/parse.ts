import type {
  Schema,
  Elements,
  Layout,
  LayoutTree,
  FlowEvent,
  FlowNode,
  Flows,
  BindElement,
  FlowEventNode,
} from '../';

export const parse = (schema: Schema) => {
  const { elements, layout, extensions, flows, bindElements } = schema;

  const _element = parseElement(elements);
  const _layout = parseLayout(layout);
  return {
    elements: _element,
    layout: _layout,
    extensions,
    flows,
    bindElements,
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

// 修复的递归：将子节点挂到当前 newEventNode.children
const recursionFlowNodes = (
  nodeId: string,
  nodes: {
    [nodeId: string]: FlowNode;
  },
): FlowEventNode => {
  const node = nodes[nodeId]!;
  const { id, type, props, next } = node;
  const newEventNode: FlowEventNode = {
    id,
    type,
    props,
    children: [],
  };
  (next || []).forEach((nextId) => {
    const childNode = recursionFlowNodes(nextId, nodes);
    newEventNode.children.push(childNode);
  });
  return newEventNode;
};

export const parseFlow = ({
  flows,
  bindElements,
}: {
  flows: Flows;
  bindElements: BindElement[];
}): FlowEvent[] => {
  const result: FlowEvent[] = [];
  bindElements?.forEach((bindElement) => {
    const { id, event, flowId } = bindElement;
    const flowEvent: FlowEvent = {
      elementId: id,
      eventName: event,
      eventNodes: [],
    };
    const eventNodes: FlowEventNode[] = [];
    const flow = flows[flowId];
    if (flow) {
      const node = recursionFlowNodes(flow.startId, flow.nodes);
      eventNodes.push(node);
    }
    flowEvent.eventNodes = eventNodes;
    result.push(flowEvent);
  });
  return result;
};
