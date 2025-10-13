import { Text } from './index';
import type { Material } from '@/interfaces/material';

const TextMaterial: Material = {
  Component: Text,
  title: '文本',
  type: 'text',
  defaultProps: {
    text: '文本',
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '内容',
            field: 'text',
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

export default TextMaterial;
