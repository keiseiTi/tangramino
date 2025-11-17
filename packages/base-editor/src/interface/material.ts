import React from 'react';
import type { EditorConfig } from './editor-config';
import type { ContextConfig } from './context-config';

export interface Material {
  /**
   * 物料对应的组件
   */
  Component: React.ComponentType;
  /**
   * 物料名称
   */
  title: string;
  /**
   * 物料类型
   */
  type: string;
  /**
   * 物料图标
   */
  icon?: React.ReactNode;
  /**
   * 拖拽到的物料类型
   */
  dropType?: string | string[];
  /**
   * 物料默认属性
   */
  defaultProps?: Record<string, unknown>;
  /**
   * 是否为容器
   */
  isContainer?: boolean;
  /**
   * 编辑器配置
   */
  editorConfig?: EditorConfig;
  /**
   * 流程上下文配置
   */
  contextConfig?: ContextConfig;
}

export interface MaterialComponentProps {
  /**
   * 是否只读
   */
  tg_readonly?: boolean;
  /**
   * 状态
   */
  tg_mode?: 'edit' | 'render';
}
