import React from 'react';
import { type Material } from '@tangramino/base-editor';
import { Drawer as AntdDrawer, type DrawerProps } from 'antd';

export type IProps = DrawerProps;

export const Drawer = (props: IProps) => {
  return <AntdDrawer {...props}>{props.children}</AntdDrawer>;
};

const DrawerMaterial: Material = {
  Component: Drawer,
  title: 'Drawer',
  type: 'drawer',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '打开', field: 'open', uiType: 'switch' },
          { label: '标题', field: 'title', uiType: 'input' },
          { label: '宽度', field: 'width', uiType: 'input' },
          { label: '高度', field: 'height', uiType: 'input' },
          {
            label: '位置',
            field: 'placement',
            uiType: 'radio',
            props: { options: [
              { label: 'left', value: 'left' },
              { label: 'right', value: 'right' },
              { label: 'top', value: 'top' },
              { label: 'bottom', value: 'bottom' },
            ] },
          },
          { label: '可关闭', field: 'closable', uiType: 'switch' },
          { label: '遮罩可关闭', field: 'maskClosable', uiType: 'switch' },
          { label: '强制渲染', field: 'forceRender', uiType: 'switch' },
          { label: '样式', field: 'style', uiType: 'input' },
          { label: '类名', field: 'className', uiType: 'input' },
        ],
      },
    ],
  },
};

export default DrawerMaterial;
