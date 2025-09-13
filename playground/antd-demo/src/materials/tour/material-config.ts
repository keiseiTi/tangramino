import type { Material } from '@tangramino/core';
import { TourComponent } from './index';

const TourMaterial: Material = {
  Component: TourComponent,
  title: '漫游式引导',
  type: 'tour',
  defaultProps: {
    open: false,
    type: 'default',
  },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            label: '打开状态',
            field: 'open',
            uiType: 'switch',
          },
          {
            label: '类型',
            field: 'type',
            uiType: 'select',
            props: {
              options: [
                { label: '默认', value: 'default' },
                { label: '主要', value: 'primary' },
              ],
            },
          },
          {
            label: '当前步骤',
            field: 'current',
            uiType: 'number',
            props: {
              min: 0,
              max: 10,
              step: 1,
            },
          },
          {
            label: '步骤配置',
            field: 'steps',
            uiType: 'input',
            props: {
              placeholder: '请输入步骤配置 JSON',
            },
          },
        ],
      },
      {
        title: '交互属性',
        configs: [
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
            label: '键盘导航',
            field: 'keyboard',
            uiType: 'switch',
          },
          {
            label: '显示遮罩',
            field: 'mask',
            uiType: 'switch',
          },
        ],
      },
      {
        title: '按钮配置',
        configs: [
          {
            label: '上一步文本',
            field: 'prevButtonProps',
            uiType: 'input',
            props: {
              placeholder: '上一步',
            },
          },
          {
            label: '下一步文本',
            field: 'nextButtonProps',
            uiType: 'input',
            props: {
              placeholder: '下一步',
            },
          },
          {
            label: '完成文本',
            field: 'finishButtonProps',
            uiType: 'input',
            props: {
              placeholder: '完成',
            },
          },
        ],
      },
      {
        title: '样式配置',
        configs: [
          {
            label: '外边距',
            field: 'margin',
            uiType: 'number',
            props: {
              min: 0,
              max: 100,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '内边距',
            field: 'padding',
            uiType: 'number',
            props: {
              min: 0,
              max: 50,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '背景色',
            field: 'backgroundColor',
            uiType: 'color',
          },
          {
            label: '文字颜色',
            field: 'color',
            uiType: 'color',
          },
          {
            label: '边框颜色',
            field: 'borderColor',
            uiType: 'color',
          },
          {
            label: '圆角',
            field: 'borderRadius',
            uiType: 'number',
            props: {
              min: 0,
              max: 20,
              step: 1,
              unit: 'px',
            },
          },
        ],
      },
    ],
  },
};

export default TourMaterial;
