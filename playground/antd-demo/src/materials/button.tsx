import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Button as AntdButton, type ButtonProps } from 'antd';

interface IProps extends ButtonProps {
  text?: string;
}

export const Button = (props: IProps) => {
  return <AntdButton {...props}>{props.text}</AntdButton>;
};

const ButtonMaterial: Material = {
  Component: Button,
  title: 'Button',
  type: 'button',
  editorConfig: {
    panels: [
      {
        title: '基础样式',
        configs: [
          {
            label: '按钮类型',
            field: 'type',
            uiType: 'select',
            props: {
              options: [
                { label: '默认', value: 'default' },
                { label: '主要', value: 'primary' },
                { label: '虚线', value: 'dashed' },
                { label: '链接', value: 'link' },
                { label: '文本', value: 'text' },
              ],
            },
          },
          {
            label: '按钮形状',
            field: 'shape',
            uiType: 'radio',
            props: {
              options: [
                { label: '默认', value: 'default' },
                { label: '圆形', value: 'circle' },
                { label: '圆角', value: 'round' },
              ],
            },
          },
          {
            label: '按钮大小',
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
        ],
      },
    ],
  },
};

export default ButtonMaterial;
