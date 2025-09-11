import React from 'react';
import type { EditorConfig } from './editor-config';

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
   * 编辑器属性配置
   */
  editorConfig?: EditorConfig;
  /**
   * 物料默认属性
   */
  defaultProps?: Record<string, unknown>;
  /**
   * 是否为容器
   */
  isContainer?: boolean;
}
