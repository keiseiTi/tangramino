import { Number } from './index';
import type { Material } from '@/interfaces/material';

const NumberMaterial: Material = {
  Component: Number,
  title: '数字框',
  type: 'number',
  defaultProps: {
    placeholder: '请输入数字',
    size: 'middle',
  },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            label: '占位符',
            field: 'placeholder',
            uiType: 'input',
            props: {
              placeholder: '请输入占位符文本',
            },
          },
          {
            label: '默认值',
            field: 'defaultValue',
            uiType: 'number',
            props: {
              min: -999999,
              max: 999999,
              step: 1,
            },
          },
          {
            label: '当前值',
            field: 'value',
            uiType: 'number',
            props: {
              min: -999999,
              max: 999999,
              step: 1,
            },
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
        ],
      },
      {
        title: '数值配置',
        configs: [
          {
            label: '最小值',
            field: 'min',
            uiType: 'number',
            props: {
              min: -999999,
              max: 999999,
              step: 1,
            },
          },
          {
            label: '最大值',
            field: 'max',
            uiType: 'number',
            props: {
              min: -999999,
              max: 999999,
              step: 1,
            },
          },
          {
            label: '步长',
            field: 'step',
            uiType: 'number',
            props: {
              min: 0.01,
              max: 100,
              step: 0.01,
            },
          },
          {
            label: '精度',
            field: 'precision',
            uiType: 'number',
            props: {
              min: 0,
              max: 10,
              step: 1,
            },
          },
          {
            label: '字符串模式',
            field: 'stringMode',
            uiType: 'switch',
          },
        ],
      },
      {
        title: '功能属性',
        configs: [
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
            label: '只读',
            field: 'readOnly',
            uiType: 'switch',
          },
          {
            label: '自动获取焦点',
            field: 'autoFocus',
            uiType: 'switch',
          },
          {
            label: '键盘控制',
            field: 'keyboard',
            uiType: 'switch',
          },
        ],
      },
      {
        title: '扩展属性',
        configs: [
          {
            label: '前缀',
            field: 'prefix',
            uiType: 'input',
            props: {
              placeholder: '请输入前缀内容',
            },
          },
          {
            label: '后缀',
            field: 'suffix',
            uiType: 'input',
            props: {
              placeholder: '请输入后缀内容',
            },
          },
          {
            label: '前置标签',
            field: 'addonBefore',
            uiType: 'input',
            props: {
              placeholder: '请输入前置标签',
            },
          },
          {
            label: '后置标签',
            field: 'addonAfter',
            uiType: 'input',
            props: {
              placeholder: '请输入后置标签',
            },
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

export default NumberMaterial;
