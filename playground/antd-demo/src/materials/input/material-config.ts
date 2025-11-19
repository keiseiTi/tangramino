import { Input } from './index';
import type { Material } from '@/interfaces/material';

const InputMaterial: Material = {
  Component: Input,
  title: '输入框',
  type: 'input',
  defaultProps: {
    placeholder: '请输入内容',
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
        description: '值改变时的回调',
        params: [
          {
            description: '事件参数',
          },
        ],
      },
      {
        name: 'onPressEnter',
        description: '回车的回调',
        params: [
          {
            description: '事件参数',
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
            label: '最大长度',
            field: 'maxLength',
            uiType: 'number',
            props: {
              min: 0,
              max: 1000,
              step: 1,
            },
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
          {
            label: '显示字数',
            field: 'showCount',
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
              step: 1,
              suffix: 'px',
            },
          },
        ],
      },
    ],
  },
};

export default InputMaterial;
