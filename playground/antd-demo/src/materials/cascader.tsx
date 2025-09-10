import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Cascader as AntdCascader, type CascaderProps } from 'antd';

export type IProps = CascaderProps<any>;

export const Cascader = (props: IProps) => {
  return <AntdCascader {...props} />;
};

const CascaderMaterial: Material = {
  Component: Cascader,
  title: '级联选择',
  type: 'cascader',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '占位符', field: 'placeholder', uiType: 'input' },
          { label: '多选', field: 'multiple', uiType: 'switch' },
          { label: '允许清除', field: 'allowClear', uiType: 'switch' },
          { label: '禁用', field: 'disabled', uiType: 'switch' },
          { label: '变更时触发', field: 'changeOnSelect', uiType: 'switch' },
          { label: '显示搜索', field: 'showSearch', uiType: 'switch' },
          {
            label: '展开触发',
            field: 'expandTrigger',
            uiType: 'radio',
            props: { options: [
              { label: 'click', value: 'click' },
              { label: 'hover', value: 'hover' },
            ] },
          },
          { label: '字段映射', field: 'fieldNames', uiType: 'input' },
          { label: '选项数据', field: 'options', uiType: 'input' },
        ],
      },
    ],
  },
};

export default CascaderMaterial;
