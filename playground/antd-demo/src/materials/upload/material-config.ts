import type { Material } from '@tangramino/core';
import { Upload } from './index';

const UploadMaterial: Material = {
  Component: Upload,
  title: '上传',
  type: 'upload',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '列表类型',
            field: 'listType',
            uiType: 'select',
            props: {
              options: [
                { label: '文本', value: 'text' },
                { label: '图片', value: 'picture' },
                { label: '图片卡片', value: 'picture-card' },
              ],
            },
          },
          {
            label: '最大数量',
            field: 'maxCount',
            uiType: 'number',
          },
          {
            label: '多选',
            field: 'multiple',
            uiType: 'switch',
          },
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '拖拽上传',
            field: 'drag',
            uiType: 'switch',
          },
          {
            label: '展示文件列表',
            field: 'showUploadList',
            uiType: 'switch',
          },
          {
            label: '接受类型',
            field: 'accept',
            uiType: 'input',
          },
          {
            label: '上传地址',
            field: 'action',
            uiType: 'input',
          },
          {
            label: '请求头',
            field: 'headers',
            uiType: 'input',
          },
          {
            label: '额外参数',
            field: 'data',
            uiType: 'input',
          },
          {
            label: '文件名字段',
            field: 'name',
            uiType: 'input',
          },
          {
            label: 'withCredentials',
            field: 'withCredentials',
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

export default UploadMaterial;
