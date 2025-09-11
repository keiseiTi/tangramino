import React from 'react';
import { type Material } from '@tangramino/core';
import { Form as AntdForm, type FormProps } from 'antd';

export interface IProps extends FormProps {
  children?: React.ReactNode;
}

export const Form = (props: IProps) => {
  return <AntdForm {...props}>{props.children}</AntdForm>;
};

const FormMaterial: Material = {
  Component: Form,
  title: '表单容器',
  type: 'form',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          {
            label: '布局',
            field: 'layout',
            uiType: 'radio',
            props: {
              options: [
                { label: 'horizontal', value: 'horizontal' },
                { label: 'vertical', value: 'vertical' },
                { label: 'inline', value: 'inline' },
              ],
            },
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: 'large', value: 'large' },
                { label: 'middle', value: 'middle' },
                { label: 'small', value: 'small' },
              ],
            },
          },
          { label: '禁用', field: 'disabled', uiType: 'switch' },
          { label: '初始值', field: 'initialValues', uiType: 'input' },
          { label: '名称', field: 'name', uiType: 'input' },
          { label: '校验触发', field: 'validateTrigger', uiType: 'input' },
          { label: '校验消息', field: 'validateMessages', uiType: 'input' },
          { label: '滚动到第一个错误', field: 'scrollToFirstError', uiType: 'switch' },
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
                { label: 'left', value: 'left' },
                { label: 'right', value: 'right' },
              ],
            },
          },
          { label: '标签列(labelCol)', field: 'labelCol', uiType: 'input' },
          { label: '控件列(wrapperCol)', field: 'wrapperCol', uiType: 'input' },
          { label: '自动完成', field: 'autoComplete', uiType: 'input' },
          { label: '类名', field: 'className', uiType: 'input' },
          { label: '样式', field: 'style', uiType: 'input' },
          { label: '字段顺序', field: 'preserve', uiType: 'switch' },
        ],
      },
    ],
  },
};

export default FormMaterial;
