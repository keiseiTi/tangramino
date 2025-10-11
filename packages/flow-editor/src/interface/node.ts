import React from 'react';
import type {
  FlowNodeMeta,
  WorkflowEdgeJSON,
  WorkflowNodeJSON,
} from '@flowgram.ai/free-layout-editor';

export interface FlowNode<T extends object = Record<string, unknown>> {
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
  nodeMeta?: FlowNodeMeta;
  /**
   * 节点渲染
   */
  renderNode?: () => React.ReactElement;
  /**
   * 节点表单渲染
   */
  renderForm?: (props: T) => React.ReactElement;
  /**
   * 流程逻辑
   */
  flowLogic?: (ctx: unknown) => unknown;
  /**
   * 节点默认属性
   */
  defaultProps?: T;
}
export interface FlowSchema {
  nodes: WorkflowNodeJSON[];
  edges: WorkflowEdgeJSON[];
}
