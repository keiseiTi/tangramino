import type { Material } from '../../interfaces/material';
import { Radio } from './index';

const RadioMaterial: Material = {
  Component: Radio,
  title: '单选框',
  type: 'radio',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '文案',
            field: 'label',
            uiType: 'input',
          },
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
            label: '自动获取焦点',
            field: 'autoFocus',
            uiType: 'switch',
          },
          {
            label: '默认选中',
            field: 'defaultChecked',
            uiType: 'switch',
          },
          {
            label: '值',
            field: 'value',
            uiType: 'input',
          },
          {
            label: '名称',
            field: 'name',
            uiType: 'input',
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

export default RadioMaterial;
