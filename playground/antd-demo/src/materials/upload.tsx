import React from 'react';
import { type Material } from '@tangramino/core';
import { Upload as AntdUpload, type UploadProps } from 'antd';

export type IProps = UploadProps;

export const Upload = (props: IProps) => {
  return <AntdUpload {...props}>{props.children}</AntdUpload>;
};

const UploadMaterial: Material = {
  Component: Upload,
  title: '上传',
  type: 'upload',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          {
            label: '列表类型',
            field: 'listType',
            uiType: 'select',
            props: { options: [
              { label: 'text', value: 'text' },
              { label: 'picture', value: 'picture' },
              { label: 'picture-card', value: 'picture-card' },
            ] },
          },
          { label: '最大数量', field: 'maxCount', uiType: 'number' },
          { label: '多选', field: 'multiple', uiType: 'switch' },
          { label: '禁用', field: 'disabled', uiType: 'switch' },
          { label: '拖拽上传', field: 'drag', uiType: 'switch' },
          { label: '展示文件列表', field: 'showUploadList', uiType: 'switch' },
          { label: '接受类型', field: 'accept', uiType: 'input' },
          { label: '上传地址', field: 'action', uiType: 'input' },
          { label: '请求头', field: 'headers', uiType: 'input' },
          { label: '额外参数', field: 'data', uiType: 'input' },
          { label: '文件名字段', field: 'name', uiType: 'input' },
          { label: 'withCredentials', field: 'withCredentials', uiType: 'switch' },
        ],
      },
    ],
  },
};

export default UploadMaterial;
