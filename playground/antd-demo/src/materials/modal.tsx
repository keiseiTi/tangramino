import React from 'react';
import { type Material } from '@tangramino/core';
import { Modal as AntdModal, type ModalProps } from 'antd';

export type IProps = ModalProps;

export const Modal = (props: IProps) => {
  return <AntdModal {...props}>{props.children}</AntdModal>;
};

const ModalMaterial: Material = {
  Component: Modal,
  title: '弹窗容器',
  type: 'modal',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '打开', field: 'open', uiType: 'switch' },
          { label: '标题', field: 'title', uiType: 'input' },
          { label: '宽度', field: 'width', uiType: 'input' },
          { label: '居中', field: 'centered', uiType: 'switch' },
          { label: '可关闭', field: 'closable', uiType: 'switch' },
          { label: '遮罩可关闭', field: 'maskClosable', uiType: 'switch' },
          { label: '页脚', field: 'footer', uiType: 'input' },
          { label: '强制渲染', field: 'forceRender', uiType: 'switch' },
          { label: '遮罩', field: 'mask', uiType: 'switch' },
          { label: '遮罩样式', field: 'maskStyle', uiType: 'input' },
          { label: '样式', field: 'style', uiType: 'input' },
          { label: '类名', field: 'className', uiType: 'input' },
          { label: '取消文本', field: 'cancelText', uiType: 'input' },
          { label: '确定文本', field: 'okText', uiType: 'input' },
          {
            label: '确定类型',
            field: 'okType',
            uiType: 'select',
            props: { options: [
              { label: 'primary', value: 'primary' },
              { label: 'default', value: 'default' },
              { label: 'dashed', value: 'dashed' },
              { label: 'link', value: 'link' },
              { label: 'text', value: 'text' },
            ] },
          },
          { label: 'Body 类名', field: 'bodyStyle', uiType: 'input' },
          { label: 'Wrap 类名', field: 'wrapClassName', uiType: 'input' },
        ],
      },
    ],
  },
};

export default ModalMaterial;
