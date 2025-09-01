import { Material } from '../../src/interface/material';
import Button from './button';
import Container from './container';
import Input from './input';
import Text from './text';

const materials: Material[] = [
  {
    title: '容器',
    Component: Container,
    type: 'container',
    isContainer: true,
  },
  {
    title: '按钮',
    Component: Button,
    type: 'button',
    dropType: 'container',
    editorConfig: {
      panels: [
        {
          title: '基础配置',
          configs: [
            {
              label: '内容',
              field: 'title',
              uiType: 'input',
            },
          ],
        },
      ],
    },
  },
  {
    title: '输入框',
    Component: Input,
    type: 'input',
    dropType: 'container',
  },
  {
    title: '文本',
    Component: Text,
    type: 'text',
    dropType: 'container',
    defaultProps: {
      text: '文本',
    },
  },
];

export default materials;
