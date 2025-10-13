import { TreeSelect } from './index';
import type { Material } from '@/interfaces/material';

const TreeSelectMaterial: Material = {
  Component: TreeSelect,
  title: '树选择器',
  type: 'treeSelect',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '多选',
            field: 'multiple',
            uiType: 'switch',
          },
          {
            label: '占位符',
            field: 'placeholder',
            uiType: 'input',
          },
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
            label: '字段映射',
            field: 'fieldNames',
            uiType: 'input',
          },
          {
            label: '弹层对齐',
            field: 'placement',
            uiType: 'select',
            props: {
              options: [
                { label: '左下', value: 'bottomLeft' },
                { label: '右下', value: 'bottomRight' },
                { label: '左上', value: 'topLeft' },
                { label: '右上', value: 'topRight' },
              ],
            },
          },
          {
            label: '节点数据',
            field: 'treeData',
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

export default TreeSelectMaterial;
