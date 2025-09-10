import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Radio as AntdRadio, type RadioProps } from 'antd';

interface IProps extends RadioProps {
  label?: string;
}

export const Radio = (props: IProps) => {
  const { label, ...rest } = props;
  return <AntdRadio {...rest}>{label}</AntdRadio>;
};

const RadioMaterial: Material = {
  Component: Radio,
  title: '单选框',
  type: 'radio',
  editorConfig: {
    panels: [
      {
        title: '基础样式',
        configs: [
          {
            label: '文案',
            field: 'label',
            uiType: 'input',
          },
          {
            label: '选中',
            field: 'checked',
            uiType: 'switch',
          },
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '自动获取焦点',
            field: 'autoFocus',
            uiType: 'switch',
          },
          {
            label: '默认选中',
            field: 'defaultChecked',
            uiType: 'switch',
          },
          {
            label: '值',
            field: 'value',
            uiType: 'input',
          },
          {
            label: '名称',
            field: 'name',
            uiType: 'input',
          },
        ],
      },
    ],
  },
};

export default RadioMaterial;
