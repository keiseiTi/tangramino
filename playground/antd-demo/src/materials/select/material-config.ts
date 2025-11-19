import { Select } from './index';
import { OptionsConfig } from '@/components/options-config';
import type { Material } from '@/interfaces/material';

const SelectMaterial: Material = {
  Component: Select,
  title: '选择器',
  type: 'select',
  defaultProps: {
    placeholder: '请选择',
    size: 'middle',
    options: [],
  },
  contextConfig: {
    variables: [
      {
        name: 'value',
        description: '当前值',
      },
      {
        name: 'options',
        description: '选项',
      },
    ],
    methods: [
      {
        name: 'onChange',
        description: '值改变时的回调',
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
            label: '模式',
            field: 'mode',
            uiType: 'select',
            props: {
              allowClear: true,
              options: [
                { label: '多选', value: 'multiple' },
                { label: '标签', value: 'tags' },
              ],
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
            label: '允许清除',
            field: 'allowClear',
            uiType: 'checkbox',
          },
          {
            label: '选项',
            field: 'options',
            uiType: 'custom',
            render: OptionsConfig,
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
        ],
      },
    ],
  },
};

export default SelectMaterial;
