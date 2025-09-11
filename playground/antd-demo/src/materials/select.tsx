import React from 'react';
import { type Material } from '@tangramino/core';
import { Select as AntdSelect, type SelectProps } from 'antd';

export type IProps = SelectProps;

export const Select = (props: IProps) => {
  return <AntdSelect style={{ minWidth: 120 }} {...props} />;
};

const SelectMaterial: Material = {
  Component: Select,
  title: '选择器',
  type: 'select',
  editorConfig: {
    panels: [
      {
        title: '基础样式',
        configs: [
          {
            label: '占位符',
            field: 'placeholder',
            uiType: 'input',
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: '大', value: 'large' },
                { label: '中', value: 'middle' },
                { label: '小', value: 'small' },
              ],
            },
          },
          {
            label: '模式',
            field: 'mode',
            uiType: 'select',
            props: {
              options: [
                { label: '默认', value: undefined },
                { label: '多选', value: 'multiple' },
                { label: '标签', value: 'tags' },
              ],
            },
          },
          {
            label: '可搜索',
            field: 'showSearch',
            uiType: 'switch',
          },
          {
            label: '允许清除',
            field: 'allowClear',
            uiType: 'switch',
          },
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '显示边框',
            field: 'bordered',
            uiType: 'switch',
          },
          {
            label: '选项配置(options)',
            field: 'options',
            uiType: 'input',
            props: {
              placeholder: '[{ label, value, disabled? }...]，后续可升级为可视化编辑',
            },
          },
        ],
      },
    ],
  },
};

export default SelectMaterial;
