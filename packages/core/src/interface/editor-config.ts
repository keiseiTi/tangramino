import React from 'react';

export type BasicAttributeConfig = {
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
};

export type TextAttributeConfig = BasicAttributeConfig & {
  uiType: 'text';
};

export type InputAttributeConfig = BasicAttributeConfig & {
  uiType: 'input';
};

export type NumberAttributeConfig = BasicAttributeConfig & {
  uiType: 'number';
};

export type RadioAttributeConfig = BasicAttributeConfig & {
  uiType: 'radio';
  props?: {
    /**
     * 标签位置，默认 left
     */
    labelPlacement?: 'left' | 'right';
    options?: {
      label: string;
      value: string | undefined | boolean;
    }[];
  };
};

export type CheckboxAttributeConfig = BasicAttributeConfig & {
  uiType: 'checkbox';
  props?: {
    /**
     * 标签位置，默认 left
     */
    labelPlacement?: 'left' | 'right';
    options?: {
      label: string;
      value: string | undefined | boolean;
    }[];
  };
};

export type SelectAttributeConfig = BasicAttributeConfig & {
  uiType: 'select';
  props?: {
    options?: {
      label: string;
      value: string | undefined | boolean;
    }[];
    placeholder?: string;
  };
};

export type SwitchAttributeConfig = BasicAttributeConfig & {
  uiType: 'switch';
};

export type CustomAttributeConfig = BasicAttributeConfig & {
  uiType: 'custom';
  render: (props: BasicAttributeConfig) => React.ReactNode;
};

export type AttributeConfig =
  | TextAttributeConfig
  | InputAttributeConfig
  | NumberAttributeConfig
  | RadioAttributeConfig
  | CheckboxAttributeConfig
  | SelectAttributeConfig
  | SwitchAttributeConfig
  | CustomAttributeConfig;

export type PanelConfig = {
  title?: React.ReactNode;
  configs?: AttributeConfig[];
};

export interface EditorConfig {
  /**
   * 属性面板配置
   */
  panels?: PanelConfig[];
}
