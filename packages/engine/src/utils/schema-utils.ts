import type { Elements, LayoutTree, Schema, InsertElement, Flows, BindElements } from '../';

/**
 * 往 schema 里插入元素
 * @param schema
 * @param originElementId
 * @param insertElement
 * @returns 返回插入后的 schema
 */
const insertElement = (schema: Schema, originElementId: string, insertElement: InsertElement) => {
  const { elements, layout } = schema;
  const newElements: Elements = {
    ...elements,
    [insertElement.id]: {
      type: insertElement.type,
      props: insertElement.props || {},
      hidden: insertElement.hidden || false,
    },
  };
  const oldChildren = layout.structure[originElementId] || [];
  const children = oldChildren.includes(insertElement.id)
    ? oldChildren
    : [...oldChildren, insertElement.id];
  const newStructure = {
    ...layout.structure,
    [originElementId]: children,
  };
  return {
    ...schema,
    elements: newElements,
    layout: { ...layout, structure: newStructure },
  };
};

/**
 * 从 schema 中删除元素
 * @param schema
 * @param elementId
 * @returns 返回删除后的 schema
 */
const removeElement = (schema: Schema, elementId: string) => {
  const { elements, layout } = schema;
  const { structure } = layout;

  // 读取时可用原结构，写入时构造新对象/新数组
  const idsToDelete = new Set<string>([elementId]);
  const queue = [elementId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = structure[currentId] || [];
    for (const childId of children) {
      if (!idsToDelete.has(childId)) {
        idsToDelete.add(childId);
        queue.push(childId);
      }
    }
  }

  const newElements: Elements = { ...elements };
  const newStructure: Record<string, string[]> = { ...structure };

  idsToDelete.forEach((id) => {
    delete newElements[id];
    delete newStructure[id];
  });

  for (const parentId of Object.keys(newStructure)) {
    const children = newStructure[parentId];
    if (!children) continue;
    const index = children.indexOf(elementId);
    if (index > -1) {
      const next = children.filter((cid) => cid !== elementId);
      newStructure[parentId] = next;
    }
  }

  return {
    ...schema,
    elements: newElements,
    layout: { ...layout, structure: newStructure },
  };
};

/**
 * 获取元素的父元素链，从直接父元素到根节点
 * @param schema
 * @param elementId
 * @returns 返回从直接父元素到根节点的元素ID数组
 */
const getParents = (schema: Schema, elementId: string): string[] => {
  const { layout } = schema;
  const { structure, root } = layout;
  const parents: string[] = [];

  if (elementId === root) {
    return parents;
  }

  const findParent = (currentId: string): string | null => {
    for (const parentId in structure) {
      const children = structure[parentId];
      if (children && children.includes(currentId)) {
        return parentId;
      }
    }
    return null;
  };

  let currentId = elementId;
  while (true) {
    const parentId = findParent(currentId);
    if (!parentId) break;

    parents.push(parentId);

    if (parentId === root) break;

    currentId = parentId;
  }

  return parents;
};

/**
 * 在同级前/后插入元素
 * @param schema
 * @param targetElementId
 * @param insertElement
 * @param position
 * @returns 返回插入后的 schema
 */
const insertAdjacentElement = (
  schema: Schema,
  targetElementId: string,
  insertElement: InsertElement,
  position: 'before' | 'after',
) => {
  const { elements, layout } = schema;
  const { structure } = layout;

  // 不可变地注册新元素
  const newElements: Elements = {
    ...elements,
    [insertElement.id]: {
      type: insertElement.type,
      props: insertElement.props || {},
      hidden: insertElement.hidden || false,
    },
  };

  // 找到目标的直接父元素
  const parents = getParents(schema, targetElementId);
  const parentId = parents[0];
  if (!parentId) {
    // 没有父级（可能是 root），不支持相邻插入
    return {
      ...schema,
      elements: newElements,
      layout,
    };
  }

  const siblings = structure[parentId] || [];
  const idx = siblings.indexOf(targetElementId);
  if (idx === -1) {
    return {
      ...schema,
      elements: newElements,
      layout,
    };
  }
  // 已经在同一个父级的 children 中存在相同 id 时不再重复插入
  if (siblings.includes(insertElement.id)) {
    return {
      ...schema,
      elements: newElements,
      layout,
    };
  }
  const insertIndex = position === 'before' ? idx : idx + 1;
  const nextSiblings = [
    ...siblings.slice(0, insertIndex),
    insertElement.id,
    ...siblings.slice(insertIndex),
  ];
  const newStructure = { ...structure, [parentId]: nextSiblings };

  return {
    ...schema,
    elements: newElements,
    layout: { ...layout, structure: newStructure },
  };
};

/**
 * 移动元素
 * @param schema
 * @param elementId
 * @param targetElementId
 * @returns 返回移动后的 schema
 */
const moveElement = (
  schema: Schema,
  elementId: string,
  targetElementId: string,
  options?: {
    mode?: 'same-level' | 'cross-level';
    position?: 'before' | 'after';
  },
): Schema => {
  const { layout } = schema;
  const { structure, root } = layout;

  // 基本保护
  if (!elementId || !targetElementId) return schema;
  if (elementId === targetElementId) return schema;
  if (elementId === root) return schema; // 不允许移动根节点

  // 判断 target 是否是 element 的后代，若是则拒绝以避免产生环
  const isDescendant = (ancestorId: string, nodeId: string): boolean => {
    const children = structure[ancestorId] || [];
    for (const childId of children) {
      if (childId === nodeId) return true;
      if (isDescendant(childId, nodeId)) return true;
    }
    return false;
  };

  if (isDescendant(elementId, targetElementId)) {
    // 不能将节点移动到它自己的后代下
    return schema;
  }

  // 工具：查找某个节点的父级 id（第一个匹配的父级）
  const newStructure: Record<string, string[]> = { ...structure };

  const findParentId = (id: string): string | undefined => {
    for (const pid in newStructure) {
      if ((newStructure[pid] || []).includes(id)) return pid;
    }
    return undefined;
  };

  const removeFromParent = (id: string) => {
    for (const pid in newStructure) {
      const arr = newStructure[pid] || [];
      const idx = arr.indexOf(id);
      if (idx > -1) {
        const next = [...arr.slice(0, idx), ...arr.slice(idx + 1)];
        newStructure[pid] = next;
        return pid;
      }
    }
    return undefined;
  };

  const mode = options?.mode ?? 'cross-level';
  if (mode === 'same-level') {
    // 同级移动：将 elementId 插入到 targetElementId 的同级列表中（before/after）
    const position = options?.position ?? 'after';
    const targetParentId = findParentId(targetElementId);
    if (!targetParentId) {
      // 没有同级（target 可能是根或未被挂载），回退为跨级移动到 target 下面
      // 继续走跨级逻辑
    } else {
      // 先从原父级移除
      removeFromParent(elementId);
      const siblings = newStructure[targetParentId] || [];
      const tIdx = siblings.indexOf(targetElementId);
      if (tIdx === -1) {
        // 理论上不应该发生，回退为跨级
      } else {
        // 先移除同级中的 elementId（若存在），再插入
        const filtered = siblings.filter((id) => id !== elementId);
        const insertIndex = position === 'before' ? tIdx : tIdx + 1;
        const next = [...filtered.slice(0, insertIndex), elementId, ...filtered.slice(insertIndex)];
        newStructure[targetParentId] = next;
        return {
          ...schema,
          layout: { ...layout, structure: newStructure },
        };
      }
    }
  }

  // 跨级移动（默认）：将 elementId 作为 targetElementId 的子节点追加到末尾
  removeFromParent(elementId);
  const list = newStructure[targetElementId] || [];
  if (!list.includes(elementId)) {
    newStructure[targetElementId] = [...list, elementId];
  }

  return {
    ...schema,
    layout: { ...layout, structure: newStructure },
  };
};

/**
 * 设置元素属性
 * @param schema
 * @param elementId
 * @param props
 * @returns 新的 schema
 */
const setElementProps = (schema: Schema, elementId: string, props: Record<string, unknown>) => {
  const { elements } = schema;
  if (elements[elementId]) {
    const newElements: Elements = {
      ...elements,
      [elementId]: {
        ...elements[elementId],
        props: { ...elements[elementId].props, ...props },
      },
    };
    return {
      ...schema,
      elements: newElements,
    };
  }
  return schema;
};

/**
 * 组合 schema
 * @param elements
 * @param layout
 * @param extensions
 * @returns 返回组合后的 schema
 */
const combineSchema = (
  elements: Elements,
  layout: LayoutTree,
  extensions: Record<string, unknown>,
  flows: Flows,
  bindElements: BindElements,
): Schema => {
  const structure: Record<string, string[]> = {};

  const traverse = (node: { id: string; children?: LayoutTree }) => {
    const children = node.children;
    if (children) {
      structure[node.id] = children.map((c) => c.id);
      children.forEach((child) => traverse(child));
    }
  };

  const rootNode = layout[0];
  const root = rootNode ? rootNode.id : '';
  if (rootNode) traverse(rootNode);

  return {
    elements,
    layout: {
      root,
      structure,
    },
    flows,
    bindElements,
    extensions,
  };
};

const getFlowGraph = <T= unknown>(schema: Schema, elementId: string, event: string) => {
  const extensions = schema.extensions;
  const key = `${elementId}::${event}`;
  return (extensions?.['flowGraph'] as Record<string, unknown>)?.[key] as T;
};

export const SchemaUtils = {
  insertElement,
  removeElement,
  insertAdjacentElement,
  moveElement,
  getParents,
  setElementProps,
  combineSchema,
  getFlowGraph,
};
