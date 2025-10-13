import { BasicPage } from './index';
import type { Material } from '@/interfaces/material';

const BasicPageMaterial: Material = {
  title: '页面',
  type: 'basicPage',
  isContainer: true,
  Component: BasicPage as React.ComponentType,
  editorConfig: {
    panels: [
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

export default BasicPageMaterial;
