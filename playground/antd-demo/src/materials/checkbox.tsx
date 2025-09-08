import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Checkbox as AntdCheckbox, type CheckboxProps } from 'antd';

interface IProps extends CheckboxProps {
  label?: string;
}

export const Checkbox = (props: IProps) => {
  const { label, ...rest } = props;
  return <AntdCheckbox {...rest}>{label}</AntdCheckbox>;
};

const CheckboxMaterial: Material = {
  Component: Checkbox,
  title: 'Checkbox',
  type: 'checkbox',
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
            label: '不确定态',
            field: 'indeterminate',
            uiType: 'switch',
          },
          {
            label: '禁用',
            field: 'disabled',
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

export default CheckboxMaterial;
