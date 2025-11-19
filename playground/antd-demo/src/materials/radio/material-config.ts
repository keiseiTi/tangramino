import { OptionsConfig } from '@/components/options-config';
import { Radio } from './index';
import type { Material } from '@/interfaces/material';

const RadioMaterial: Material = {
  Component: Radio,
  title: '单选框',
  type: 'radio',
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
      {
        name: 'options',
        description: '选项',
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
    ],
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '选项是否用按钮展示',
            field: 'optionDisplayButton',
            uiType: 'checkbox',
          },
          {
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
            label: '尺寸',
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
          },
        ],
      },
    ],
  },
};

export default RadioMaterial;
