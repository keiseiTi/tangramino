import { Drawer } from './index';
import type { Material } from '@/interfaces/material';

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
            uiType: 'checkbox',
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
            uiType: 'checkbox',
          },
          {
            label: '遮罩可关闭',
            field: 'maskClosable',
            uiType: 'checkbox',
          },
          {
            label: '强制渲染',
            field: 'forceRender',
            uiType: 'checkbox',
          },
          {
            label: '类名',
            field: 'className',
            uiType: 'input',
          },
        ],
      },

    ],
  },
};

export default DrawerMaterial;
