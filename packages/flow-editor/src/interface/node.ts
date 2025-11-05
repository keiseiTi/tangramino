import React from 'react';
import type {
  WorkflowNodeMeta,
  WorkflowEdgeJSON,
  WorkflowNodeJSON,
} from '@flowgram.ai/free-layout-editor';

export interface FlowNode {
  /**
   * 节点类型
   */
  type: string;
  /**
   * 节点标题
   */
  title: string;
  /**
   * 节点元数据
   */
  nodeMeta?: Partial<WorkflowNodeMeta>;
  /**
   * 节点渲染
   */
  renderNode?: () => React.ReactElement;
  /**
   * 节点表单渲染
   */
  renderForm?: <T>(props: T) => React.ReactElement;
  /**
   * 流程逻辑
   */
  flowLogic?: <T>(ctx: T) => Promise<unknown> | unknown;

  /**
   * 节点默认属性
   */
  defaultProps?: Record<string, unknown>;
}
export interface FlowGraphData {
  nodes: WorkflowNodeJSON[];
  edges: WorkflowEdgeJSON[];
}
