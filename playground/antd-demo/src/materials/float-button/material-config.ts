import { FloatButtonComponent } from './index';
import type { Material } from '@/interfaces/material';

const FloatButtonMaterial: Material = {
  Component: FloatButtonComponent,
  title: '悬浮按钮',
  type: 'floatButton',
  defaultProps: {
    type: 'default',
    shape: 'circle',
  },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            label: '按钮类型',
            field: 'type',
            uiType: 'select',
            props: {
              options: [
                { label: '默认', value: 'default' },
                { label: '主要', value: 'primary' },
              ],
            },
          },
          {
            label: '按钮形状',
            field: 'shape',
            uiType: 'radio',
            props: {
              options: [
                { label: '圆形', value: 'circle' },
                { label: '方形', value: 'square' },
              ],
            },
          },
          {
            label: '位置',
            field: 'placement',
            uiType: 'select',
            props: {
              options: [
                { label: '右下', value: 'bottomRight' },
                { label: '左下', value: 'bottomLeft' },
                { label: '右上', value: 'topRight' },
                { label: '左上', value: 'topLeft' },
              ],
            },
          },
          {
            label: '描述',
            field: 'description',
            uiType: 'input',
            props: {
              placeholder: '请输入描述文本',
            },
          },
          {
            label: '工具提示',
            field: 'tooltip',
            uiType: 'input',
            props: {
              placeholder: '请输入工具提示文本',
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

export default FloatButtonMaterial;
