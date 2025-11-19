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
        title: '属性',
        configs: [],
      },
      
    ],
  },
};

export default BasicPageMaterial;
