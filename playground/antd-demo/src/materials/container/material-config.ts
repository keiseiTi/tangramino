import { Container } from './index';
import type { Material } from '@/interfaces/material';

const ContainerMaterial: Material = {
  Component: Container,
  title: '容器',
  type: 'container',
  isContainer: true,
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

export default ContainerMaterial;
