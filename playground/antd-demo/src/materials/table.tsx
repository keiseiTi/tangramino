import React from 'react';
import { type Material } from '@tangramino/core';
import { Table as AntdTable, type TableProps } from 'antd';

export type IProps = TableProps<any>;

export const Table = (props: IProps) => {
  return <AntdTable {...props} />;
};

const TableMaterial: Material = {
  Component: Table,
  title: '表格',
  type: 'table',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '边框', field: 'bordered', uiType: 'switch' },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: { options: [
              { label: 'large', value: 'large' },
              { label: 'middle', value: 'middle' },
              { label: 'small', value: 'small' },
            ] },
          },
          { label: '表头固定(sticky)', field: 'sticky', uiType: 'switch' },
          { label: '行 key', field: 'rowKey', uiType: 'input' },
          { label: '分页配置', field: 'pagination', uiType: 'input' },
          { label: '滚动配置', field: 'scroll', uiType: 'input' },
          { label: '行选择', field: 'rowSelection', uiType: 'input' },
          { label: '数据源', field: 'dataSource', uiType: 'input' },
          { label: '列定义', field: 'columns', uiType: 'input' },
          { label: '加载中', field: 'loading', uiType: 'input' },
          { label: '表格标题', field: 'title', uiType: 'input' },
          { label: '空状态文案', field: 'locale', uiType: 'input' },
          { label: '表格类名', field: 'className', uiType: 'input' },
        ],
      },
    ],
  },
};

export default TableMaterial;
