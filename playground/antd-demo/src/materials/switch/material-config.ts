import type { Material } from '../../interfaces/material';
import { Switch } from './index';

const SwitchMaterial: Material = {
  Component: Switch,
  title: '开关',
  type: 'switch',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '选中',
            field: 'checked',
            uiType: 'switch',
          },
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '加载中',
            field: 'loading',
            uiType: 'switch',
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: '小', value: 'small' },
                { label: '默认', value: 'default' },
              ],
            },
          },
          {
            label: '选中文案',
            field: 'checkedChildren',
            uiType: 'input',
          },
          {
            label: '未选中文案',
            field: 'unCheckedChildren',
            uiType: 'input',
          },
          {
            label: '默认选中',
            field: 'defaultChecked',
            uiType: 'switch',
          },
        ],
      },
      {
        title: '样式',
        configs: [
          {
            label: '外边距',
            field: 'margin',
            uiType: 'number',
          },
          {
            label: '内边距',
            field: 'padding',
            uiType: 'number',
          },
        ],
      },
    ],
  },
};

export default SwitchMaterial;
