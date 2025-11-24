import React from 'react';
import type { EditorConfig } from './editor-config';
import type { ContextConfig } from './context-config';

/**
 * Material definition for editor components
 * Defines the structure and configuration for components that can be used in the editor
 */
export interface Material {
  /**
   * The React component for this material
   * 物料对应的组件
   */
  Component: React.ComponentType;
  /**
   * Display name of the material
   * 物料名称
   */
  title: string;
  /**
   * Unique type identifier for the material
   * 物料类型
   */
  type: string;
  /**
   * Icon to display in the material palette
   * 物料图标
   */
  icon?: React.ReactNode;
  /**
   * Allowed drop target types (which materials can be dropped into this one)
   * 拖拽到的物料类型
   */
  dropTypes?: string[];
  /**
   * Default props to apply when the material is first added
   * 物料默认属性
   */
  defaultProps?: Record<string, unknown>;
  /**
   * Whether this material can contain other materials
   * 是否为容器
   */
  isContainer?: boolean;
  /**
   * Editor configuration for the material's properties panel
   * 编辑器配置
   */
  editorConfig?: EditorConfig;
  /**
   * Context configuration for flow-based interactions
   * 流程上下文配置
   */
  contextConfig?: ContextConfig;
}

/**
 * Props automatically injected into material components by the editor
 */
export interface MaterialComponentProps {
  /**
   * Whether the component is in read-only mode
   * 是否只读
   */
  tg_readonly?: boolean;
  /**
   * Current mode of the component
   * 状态
   */
  tg_mode?: 'design' | 'render';
  /**
   * Drop placeholder to display when dragging over the component
   * 拖拽到组件上的占位符，物料设置了 isContainer，才有这个属性
   */
  tg_dropPlaceholder?: React.ReactNode;
  /**
   * Set context values
   * 设置上下文值
   */
  tg_setContextValues?: (contextValues: Record<string, unknown>) => void;
}
