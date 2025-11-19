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
        title: '属性',
        configs: [],
      },
      
    ],
  },
};

export default ContainerMaterial;
