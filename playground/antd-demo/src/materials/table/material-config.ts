import { Table } from './index';
import type { Material } from '@/interfaces/material';

const TableMaterial: Material = {
  Component: Table,
  title: '表格',
  type: 'table',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '边框',
            field: 'bordered',
            uiType: 'switch',
          },
          {
            label: '大小',
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
            label: '表头固定(sticky)',
            field: 'sticky',
            uiType: 'switch',
          },
          {
            label: '行 key',
            field: 'rowKey',
            uiType: 'input',
          },
          {
            label: '分页配置',
            field: 'pagination',
            uiType: 'input',
          },
          {
            label: '滚动配置',
            field: 'scroll',
            uiType: 'input',
          },
          {
            label: '行选择',
            field: 'rowSelection',
            uiType: 'input',
          },
          {
            label: '数据源',
            field: 'dataSource',
            uiType: 'input',
          },
          {
            label: '列定义',
            field: 'columns',
            uiType: 'input',
          },
          {
            label: '加载中',
            field: 'loading',
            uiType: 'switch',
          },
          {
            label: '表格标题',
            field: 'title',
            uiType: 'input',
          },
          {
            label: '空状态文案',
            field: 'locale',
            uiType: 'input',
          },
          {
            label: '表格类名',
            field: 'className',
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

export default TableMaterial;
