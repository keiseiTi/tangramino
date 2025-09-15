import type { Schema, Elements, Layout, LayoutTree, LogicFlow } from '../';

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

export const parseFlow = (logicFlow: LogicFlow) => {
  const { flows, bindElements } = logicFlow;
  // const result = [];
  return { flows, bindElements };
};
