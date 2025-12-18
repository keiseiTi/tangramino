import { Container } from './index';
import type { Material } from '@/interfaces/material';

const ContainerMaterial: Material = {
  Component: Container,
  title: '容器',
  type: 'container',
  dropTypes: ['basicPage', 'container'],
  isContainer: true,
  defaultProps: {
    heightConfig: 'fixed',
    height: 200,
  },
  // 根据 heightConfig 动态设置 wrapper 样式
  wrapperStyle: (props) => {
    if (props.heightConfig === 'auto') {
      // 自适应高度：wrapper 需要 flex: 1 来填充剩余空间
      return {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      };
    }
    // 固定高度：wrapper 使用 auto 以适应内容
    return {
      flex: '0 0 auto',
      display: 'flex',
      flexDirection: 'column',
    };
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [],
      },
      {
        title: '样式',
        configs: [
          {
            label: '高度配置',
            field: 'heightConfig',
            uiType: 'select',
            defaultValue: 'fixed',
            props: {
              options: [
                { label: '固定高度', value: 'fixed' },
                { label: '自适应', value: 'auto' },
              ],
            },
          },
          {
            label: '高度',
            field: 'height',
            uiType: 'number',
            props: {
              suffix: 'px',
            },
            linkageShow: [{ field: 'heightConfig', value: 'fixed' }],
          },
          {
            label: '外边距',
            field: 'margin',
            uiType: 'number',
            props: {
              suffix: 'px',
            },
          },
          {
            label: '内边距',
            field: 'padding',
            uiType: 'number',
            props: {
              suffix: 'px',
            },
          },
        ],
      },
    ],
  },
};

export default ContainerMaterial;
