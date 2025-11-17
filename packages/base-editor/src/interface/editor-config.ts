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
   * 联动显示
   */
  linkageShow?: {
    /**
     * 关联的字段
     */
    field: string;
    /**
     * 关联字段的值
     */
    value?: string | number | boolean;
    /**
     * 当被关联的字段有值时，展示当前配置
     */
    isNotEmpty?: boolean;
  }[];
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

export interface EditorConfig {
  /**
   * 属性面板配置
   */
  panels?: PanelConfig[];
}
