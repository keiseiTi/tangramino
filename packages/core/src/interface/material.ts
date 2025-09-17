import React from 'react';
import type { EditorConfig } from './editor-config';
import type { ContextValue } from './context-value';

export interface Material {
  /**
   * 物料对应的组件
   */
  Component: React.ComponentType;
  /**
   * 物料名称
   */
  title: React.ReactNode;
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
   * 上下文值
   */
  contextValue?: ContextValue;
}
