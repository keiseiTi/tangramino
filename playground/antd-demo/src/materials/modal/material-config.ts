import { Modal } from './index';
import type { Material } from '@/interfaces/material';

const ModalMaterial: Material = {
  Component: Modal,
  title: '弹窗容器',
  type: 'modal',
  isContainer: true,
  defaultProps: {
    open: false,
    centered: false,
    closable: true,
    maskClosable: true,
    mask: true,
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '打开状态',
            field: 'open',
            uiType: 'switch',
          },
          {
            label: '标题',
            field: 'title',
            uiType: 'input',
            props: {
              placeholder: '请输入弹窗标题',
            },
          },
          {
            label: '宽度',
            field: 'width',
            uiType: 'number',
            props: {
              min: 200,
              max: 1200,
              step: 10,
              unit: 'px',
            },
          },
          {
            label: '高度',
            field: 'height',
            uiType: 'number',
            props: {
              min: 100,
              max: 800,
              step: 10,
              unit: 'px',
            },
          },
          {
            label: '居中显示',
            field: 'centered',
            uiType: 'switch',
          },
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
            label: '强制渲染',
            field: 'forceRender',
            uiType: 'switch',
          },
          {
            label: '显示遮罩',
            field: 'mask',
            uiType: 'switch',
          },
          {
            label: '键盘ESC关闭',
            field: 'keyboard',
            uiType: 'switch',
          },
          {
            label: '取消文本',
            field: 'cancelText',
            uiType: 'input',
            props: {
              placeholder: '取消',
            },
          },
          {
            label: '确定文本',
            field: 'okText',
            uiType: 'input',
            props: {
              placeholder: '确定',
            },
          },
          {
            label: '确定按钮类型',
            field: 'okType',
            uiType: 'select',
            props: {
              options: [
                { label: '主要', value: 'primary' },
                { label: '默认', value: 'default' },
                { label: '虚线', value: 'dashed' },
                { label: '链接', value: 'link' },
                { label: '文本', value: 'text' },
              ],
            },
          },
          {
            label: '确定按钮加载',
            field: 'confirmLoading',
            uiType: 'switch',
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
            label: '遮罩颜色',
            field: 'maskStyle',
            uiType: 'input',
            props: {
              placeholder: '例如: { backgroundColor: "rgba(0,0,0,0.5)" }',
            },
          },
          {
            label: 'Body 样式',
            field: 'bodyStyle',
            uiType: 'input',
            props: {
              placeholder: '例如: { padding: "20px" }',
            },
          },
          {
            label: 'Wrap 类名',
            field: 'wrapClassName',
            uiType: 'input',
            props: {
              placeholder: '请输入自定义类名',
            },
          },
        ],
      },
    ],
  },
};

export default ModalMaterial;
