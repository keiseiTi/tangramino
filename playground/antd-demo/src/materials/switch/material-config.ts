import { Switch } from './index';
import type { Material } from '@/interfaces/material';

const SwitchMaterial: Material = {
  Component: Switch,
  title: '开关',
  type: 'switch',
  contextConfig: {
    variables: [
      {
        name: 'checked',
        description: '是否选中',
      },
      {
        name: 'disabled',
        description: '是否禁用',
      },
      {
        name: 'loading',
        description: '加载中的开关',
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
            label: '初始是否选中',
            field: 'defaultChecked',
            uiType: 'checkbox',
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

export default SwitchMaterial;
