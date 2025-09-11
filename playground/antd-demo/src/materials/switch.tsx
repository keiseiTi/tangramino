import React from 'react';
import { type Material } from '@tangramino/core';
import { Switch as AntdSwitch, type SwitchProps } from 'antd';

export type IProps = SwitchProps;

export const Switch = (props: IProps) => {
  return <AntdSwitch {...props} />;
};

const SwitchMaterial: Material = {
  Component: Switch,
  title: '开关',
  type: 'switch',
  editorConfig: {
    panels: [
      {
        title: '基础样式',
        configs: [
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
            label: '加载中',
            field: 'loading',
            uiType: 'switch',
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: '小', value: 'small' },
                { label: '默认', value: 'default' },
              ],
            },
          },
          {
            label: '选中文案',
            field: 'checkedChildren',
            uiType: 'input',
          },
          {
            label: '未选中文案',
            field: 'unCheckedChildren',
            uiType: 'input',
          },
          {
            label: '默认选中',
            field: 'defaultChecked',
            uiType: 'switch',
          },
        ],
      },
    ],
  },
};

export default SwitchMaterial;
