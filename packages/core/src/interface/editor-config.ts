import React from 'react';

export type AttributeConfig = {
  /**
   * 属性名称
   */
  label?: React.ReactNode;
  /**
   * 属性名称
   */
  field: string;
  /**
   * 属性类型
   */
  uiType?: string;
  /**
   * 默认值
   */
  defaultValue?: string | number | boolean;
  /**
   * 自定义渲染
   */
  render?: (props: AttributeConfig) => React.ReactNode;
};

export type PanelConfig = {
  /**
   * 面板标题
   */
  title?: React.ReactNode;
  /**
   * 属性配置
   */
  configs?: AttributeConfig[];
};

export type EventFlow = {
  /**
   * 事件名称
   */
  event: string;
  /**
   * 事件描述
   */
  description?: string;
  /**
   * 事件参数
   */
  params?: {
    /**
     * 参数描述
     */
    description: string;
    /**
     * 参数字段
     */
    fields?: Record<string, unknown>;
  }[];
};

export type ContextValue = {
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  description?: string;
};

export type Variable = ContextValue;

export interface EditorConfig {
  /**
   * 属性面板配置
   */
  panels?: PanelConfig[];
  /**
   * 事件流配置
   *
   */
  eventFlows?: EventFlow[];
  /**
   * 变量
   */
  variables?: Variable[];
  /**
   * 变量提供者
   */
  variableProviders?: ContextValue[];
}
