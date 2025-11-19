import { Form } from './index';
import type { Material } from '@/interfaces/material';

const FormMaterial: Material = {
  Component: Form,
  title: '表单容器',
  type: 'form',
  isContainer: true,
  defaultProps: {
    layout: 'vertical',
    size: 'middle',
    preserve: false,
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '布局',
            field: 'layout',
            uiType: 'radio',
            props: {
              options: [
                { label: '水平', value: 'horizontal' },
                { label: '垂直', value: 'vertical' },
                { label: '内联', value: 'inline' },
              ],
            },
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: '大', value: 'large' },
                { label: '中', value: 'middle' },
                { label: '小', value: 'small' },
              ],
            },
          },
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '名称',
            field: 'name',
            uiType: 'input',
            props: {
              placeholder: '请输入表单名称',
            },
          },
          {
            label: '初始值',
            field: 'initialValues',
            uiType: 'input',
            props: {
              placeholder: '请输入初始值 JSON',
            },
          },
          {
            label: '校验触发',
            field: 'validateTrigger',
            uiType: 'select',
            props: {
              options: [
                { label: 'onChange', value: 'onChange' },
                { label: 'onBlur', value: 'onBlur' },
                { label: 'onSubmit', value: 'onSubmit' },
              ],
            },
          },
          {
            label: '校验消息',
            field: 'validateMessages',
            uiType: 'input',
            props: {
              placeholder: '请输入校验消息 JSON',
            },
          },
          {
            label: '滚动到第一个错误',
            field: 'scrollToFirstError',
            uiType: 'switch',
          },
          {
            label: '必填星号',
            field: 'requiredMark',
            uiType: 'radio',
            props: {
              options: [
                { label: '默认', value: undefined },
                { label: '显示', value: true },
                { label: '隐藏', value: false },
                { label: '可选', value: 'optional' },
              ],
            },
          },
          {
            label: '标签对齐',
            field: 'labelAlign',
            uiType: 'radio',
            props: {
              options: [
                { label: '左对齐', value: 'left' },
                { label: '右对齐', value: 'right' },
              ],
            },
          },
          {
            label: '标签列(labelCol)',
            field: 'labelCol',
            uiType: 'input',
            props: {
              placeholder: '例如: { span: 6 }',
            },
          },
          {
            label: '控件列(wrapperCol)',
            field: 'wrapperCol',
            uiType: 'input',
            props: {
              placeholder: '例如: { span: 18 }',
            },
          },
          {
            label: '自动完成',
            field: 'autoComplete',
            uiType: 'select',
            props: {
              options: [
                { label: 'on', value: 'on' },
                { label: 'off', value: 'off' },
              ],
            },
          },
          {
            label: '字段顺序',
            field: 'preserve',
            uiType: 'switch',
          },
        ],
      },
      
    ],
  },
};

export default FormMaterial;
