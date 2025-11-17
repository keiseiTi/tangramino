import { Number } from './index';
import type { Material } from '@/interfaces/material';

const NumberMaterial: Material = {
  Component: Number,
  title: '数字框',
  type: 'number',
  defaultProps: {
    placeholder: '请输入',
    size: 'middle',
  },
  contextConfig: {
    variables: [
      {
        name: 'value',
        description: '当前值',
      },
      {
        name: 'disabled',
        description: '是否禁用',
      },
    ],
    methods: [
      {
        name: 'onChange',
        description: '内容变化时的回调',
        params: [
          {
            description: '输入事件参数',
          },
        ],
      },
      {
        name: 'onPressEnter',
        description: '回车的回调',
        params: [
          {
            description: '输入事件参数',
          },
        ],
      },
    ],
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
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
            props: {},
          },
          {
            label: '最小值',
            field: 'min',
            uiType: 'number',
            props: {
              step: 1,
            },
          },
          {
            label: '最大值',
            field: 'max',
            uiType: 'number',
            props: {
              step: 1,
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
            label: '前缀',
            field: 'prefix',
            uiType: 'input',
            props: {},
          },
          {
            label: '后缀',
            field: 'suffix',
            uiType: 'input',
            props: {},
          },
          {
            label: '前置标签',
            field: 'addonBefore',
            uiType: 'input',
            props: {},
          },
          {
            label: '后置标签',
            field: 'addonAfter',
            uiType: 'input',
            props: {},
          },
          {
            label: '允许清除',
            field: 'allowClear',
            uiType: 'checkbox',
          },
        ],
      },
      {
        title: '样式',
        configs: [
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
            label: '外边距',
            field: 'margin',
            uiType: 'number',
            props: {
              min: 0,
              max: 100,
              step: 1,
              suffix: 'px',
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
              suffix: 'px',
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
              suffix: 'px',
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
              suffix: 'px',
            },
          },
        ],
      },
    ],
  },
};

export default NumberMaterial;
