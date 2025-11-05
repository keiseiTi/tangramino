import type { Flow, FlowNode } from '@tangramino/engine';
import type { FlowGraphData } from '@tangramino/flow-editor';

export * from './cn';

type Condition = {
  value: boolean;
  nextNode: string;
};

export const transformFlowGraph2Flow = (flowGraphData: FlowGraphData): Flow => {
  const { nodes, edges } = flowGraphData;

  // 找到开始节点
  const startNode = nodes.find((node) => node.type === 'start')!;

  // 创建节点映射，初始化每个节点的 prev 和 next 数组
  const flowNodes: { [nodeId: string]: FlowNode } = {};

  // 初始化所有节点
  nodes.forEach((node) => {
    flowNodes[node.id] = {
      id: node.id,
      type: node.type as string,
      props: node.data || {},
      prev: [],
      next: [],
    };
  });

  // 根据边构建节点间的关系
  edges.forEach((edge) => {
    const sourceNodeId = edge.sourceNodeID;
    const targetNodeId = edge.targetNodeID;
    const sourceNode = flowNodes[sourceNodeId];
    const targetNode = flowNodes[targetNodeId];

    // 为源节点添加 next 关系
    if (sourceNode) {
      if (sourceNode.type === 'condition') {
        sourceNode.props.condition = sourceNode.props.condition || [];
        if (typeof edge.data?.value === 'boolean') {
          (sourceNode.props.condition as Condition[]).push({
            value: edge.data?.value,
            nextNode: targetNodeId,
          });
        }
      }
      sourceNode.next.push(targetNodeId);
    }

    // 为目标节点添加 prev 关系
    if (targetNode) {
      targetNode.prev.push(sourceNodeId);
    }
  });

  return {
    startId: startNode.id,
    nodes: flowNodes,
  };
};
