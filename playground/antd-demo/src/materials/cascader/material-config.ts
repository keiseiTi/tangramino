import type { Material } from '@tangramino/core';
import { Cascader } from './index';

const CascaderMaterial: Material = {
  Component: Cascader,
  title: '级联选择',
  type: 'cascader',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '占位符',
            field: 'placeholder',
            uiType: 'input',
          },
          {
            label: '多选',
            field: 'multiple',
            uiType: 'switch',
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
            label: '变更时触发',
            field: 'changeOnSelect',
            uiType: 'switch',
          },
          {
            label: '显示搜索',
            field: 'showSearch',
            uiType: 'switch',
          },
          {
            label: '展开触发',
            field: 'expandTrigger',
            uiType: 'radio',
            props: {
              options: [
                { label: '点击', value: 'click' },
                { label: '悬停', value: 'hover' },
              ],
            },
          },
          {
            label: '字段映射',
            field: 'fieldNames',
            uiType: 'input',
          },
          {
            label: '选项数据',
            field: 'options',
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

export default CascaderMaterial;
