import type { Material } from '../../interfaces/material';
import { Drawer } from './index';

const DrawerMaterial: Material = {
  Component: Drawer,
  title: '抽屉容器',
  type: 'drawer',
  isContainer: true,
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '打开',
            field: 'open',
            uiType: 'switch',
          },
          {
            label: '标题',
            field: 'title',
            uiType: 'input',
          },
          {
            label: '宽度',
            field: 'width',
            uiType: 'input',
          },
          {
            label: '高度',
            field: 'height',
            uiType: 'input',
          },
          {
            label: '位置',
            field: 'placement',
            uiType: 'radio',
            props: {
              options: [
                { label: '左侧', value: 'left' },
                { label: '右侧', value: 'right' },
                { label: '顶部', value: 'top' },
                { label: '底部', value: 'bottom' },
              ],
            },
          },
          {
            label: '可关闭',
            field: 'closable',
            uiType: 'switch',
          },
          {
            label: '遮罩可关闭',
            field: 'maskClosable',
            uiType: 'switch',
          },
          {
            label: '强制渲染',
            field: 'forceRender',
            uiType: 'switch',
          },
          {
            label: '样式',
            field: 'style',
            uiType: 'input',
          },
          {
            label: '类名',
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

export default DrawerMaterial;
