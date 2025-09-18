import type { Material } from '../../interfaces/material';
import { Input } from './index';

const InputMaterial: Material = {
  Component: Input,
  title: '输入框',
  type: 'input',
  defaultProps: {
    placeholder: '请输入内容',
    size: 'middle',
  },
  editorConfig: {
    eventFlows: [
      {
        event: 'onChange',
        description: '内容变化时的回调',
        params: [
          {
            description: '输入事件参数',
          },
        ],
      },
      {
        event: 'onPressEnter',
        description: '回车的回调',
        params: [
          {
            description: '输入事件参数',
          },
        ],
      },
    ],
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
            uiType: 'input',
            props: {
              placeholder: '请输入默认值',
            },
          },
          {
            label: '当前值',
            field: 'value',
            uiType: 'input',
            props: {
              placeholder: '请输入当前值',
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
            label: '显示字数',
            field: 'showCount',
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
        ],
      },
    ],
  },
};

export default InputMaterial;
