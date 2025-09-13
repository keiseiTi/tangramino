import type { Material } from '@tangramino/core';
import { Button } from './index';

const ButtonMaterial: Material = {
  Component: Button,
  title: '按钮',
  type: 'button',
  defaultProps: {
    text: '按钮',
    type: 'default',
    size: 'middle',
  },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            label: '按钮文本',
            field: 'text',
            uiType: 'input',
            props: {
              placeholder: '请输入按钮文本',
            },
          },
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
      {
        title: '状态属性',
        configs: [
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '危险按钮',
            field: 'danger',
            uiType: 'switch',
          },
          {
            label: '幽灵按钮',
            field: 'ghost',
            uiType: 'switch',
          },
          {
            label: '块级按钮',
            field: 'block',
            uiType: 'switch',
          },
          {
            label: '加载中',
            field: 'loading',
            uiType: 'switch',
          },
        ],
      },
      {
        title: '样式配置',
        configs: [
          {
            label: '外边距',
            field: 'margin',
            uiType: 'number',
            props: {
              min: 0,
              max: 100,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '内边距',
            field: 'padding',
            uiType: 'number',
            props: {
              min: 0,
              max: 50,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '宽度',
            field: 'width',
            uiType: 'number',
            props: {
              min: 0,
              max: 500,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '高度',
            field: 'height',
            uiType: 'number',
            props: {
              min: 0,
              max: 100,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '背景色',
            field: 'backgroundColor',
            uiType: 'color',
          },
          {
            label: '文字颜色',
            field: 'color',
            uiType: 'color',
          },
          {
            label: '边框颜色',
            field: 'borderColor',
            uiType: 'color',
          },
          {
            label: '圆角',
            field: 'borderRadius',
            uiType: 'number',
            props: {
              min: 0,
              max: 20,
              step: 1,
              unit: 'px',
            },
          },
        ],
      },
    ],
  },
};

export default ButtonMaterial;
