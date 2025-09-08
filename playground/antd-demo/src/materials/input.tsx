import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Input as AntdInput, type InputProps } from 'antd';

export type IProps = InputProps;

export const Input = (props: IProps) => {
  return <AntdInput {...props} />;
};

const InputMaterial: Material = {
  Component: Input,
  title: 'Input',
  type: 'input',
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
            label: '最大长度',
            field: 'maxLength',
            uiType: 'number',
          },
          {
            label: '显示字数',
            field: 'showCount',
            uiType: 'switch',
          },
          {
            label: '默认值',
            field: 'defaultValue',
            uiType: 'input',
          },
          {
            label: '当前值',
            field: 'value',
            uiType: 'input',
          },
          {
            label: '状态',
            field: 'status',
            uiType: 'radio',
            props: {
              options: [
                { label: '默认', value: undefined },
                { label: '错误', value: 'error' },
                { label: '警告', value: 'warning' },
              ],
            },
          },
          {
            label: '前缀',
            field: 'prefix',
            uiType: 'input',
          },
          {
            label: '后缀',
            field: 'suffix',
            uiType: 'input',
          },
          {
            label: '前置标签',
            field: 'addonBefore',
            uiType: 'input',
          },
          {
            label: '后置标签',
            field: 'addonAfter',
            uiType: 'input',
          },
          {
            label: '只读',
            field: 'readOnly',
            uiType: 'switch',
          },
          {
            label: '自动获取焦点',
            field: 'autoFocus',
            uiType: 'switch',
          },
        ],
      },
    ],
  },
};

export default InputMaterial;
