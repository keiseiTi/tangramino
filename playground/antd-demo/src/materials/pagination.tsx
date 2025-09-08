import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Pagination as AntdPagination, type PaginationProps } from 'antd';

export type IProps = PaginationProps;

export const Pagination = (props: IProps) => {
  return <AntdPagination {...props} />;
};

const PaginationMaterial: Material = {
  Component: Pagination,
  title: 'Pagination',
  type: 'pagination',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '当前页', field: 'current', uiType: 'number' },
          { label: '每页条数', field: 'pageSize', uiType: 'number' },
          { label: '总数', field: 'total', uiType: 'number' },
          { label: '显示快速跳转', field: 'showQuickJumper', uiType: 'switch' },
          { label: '显示总数文案', field: 'showTotal', uiType: 'input' },
          { label: '显示改变页大小', field: 'showSizeChanger', uiType: 'switch' },
          { label: '简单模式', field: 'simple', uiType: 'switch' },
          {
            label: '尺寸',
            field: 'size',
            uiType: 'radio',
            props: { options: [
              { label: 'default', value: 'default' },
              { label: 'small', value: 'small' },
            ] },
          },
        ],
      },
    ],
  },
};

export default PaginationMaterial;
