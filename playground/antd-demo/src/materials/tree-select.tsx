import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { TreeSelect as AntdTreeSelect, type TreeSelectProps } from 'antd';

export type IProps = TreeSelectProps;

export const TreeSelect = (props: IProps) => {
  return <AntdTreeSelect {...props} />;
};

const TreeSelectMaterial: Material = {
  Component: TreeSelect,
  title: 'TreeSelect',
  type: 'tree-select',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '多选', field: 'multiple', uiType: 'switch' },
          { label: '占位符', field: 'placeholder', uiType: 'input' },
          { label: '允许清除', field: 'allowClear', uiType: 'switch' },
          { label: '禁用', field: 'disabled', uiType: 'switch' },
          { label: '字段映射', field: 'fieldNames', uiType: 'input' },
          {
            label: '弹层对齐',
            field: 'placement',
            uiType: 'select',
            props: { options: [
              { label: 'bottomLeft', value: 'bottomLeft' },
              { label: 'bottomRight', value: 'bottomRight' },
              { label: 'topLeft', value: 'topLeft' },
              { label: 'topRight', value: 'topRight' },
            ] },
          },
          { label: '节点数据', field: 'treeData', uiType: 'input' },
        ],
      },
    ],
  },
};

export default TreeSelectMaterial;
