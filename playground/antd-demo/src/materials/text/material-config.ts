import { Text } from './index';
import type { Material } from '@/interfaces/material';

const TextMaterial: Material = {
  Component: Text,
  title: '文本',
  type: 'text',
  defaultProps: {
    text: '文本',
  },
  contextConfig: {
    variables: [
      {
        name: 'text',
        description: '文本内容',
      },
    ],
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
          {
            label: '字体大小',
            field: 'fontSize',
            uiType: 'input',
          },
          {
            label: '字体颜色',
            field: 'color',
            uiType: 'color',
          },
          {
            label: '背景色',
            field: 'backgroundColor',
            uiType: 'color',
          },
          {
            label: '粗体',
            field: 'bold',
            uiType: 'checkbox',
          },
          {
            label: '斜体',
            field: 'italic',
            uiType: 'checkbox',
          },
        ],
      },
    ],
  },
};

export default TextMaterial;
