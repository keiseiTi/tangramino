import React from 'react';
import { Form as AntdForm, type FormProps } from 'antd';
import type { MaterialComponentProps } from '@tangramino/base-editor';

const FormItem = AntdForm.Item;
export interface IProps extends FormProps, MaterialComponentProps {
  children?: React.ReactNode;
}

export const Form = (props: IProps) => {
  const { children, tg_dropPlaceholder, ...restProps } = props;

  const formItems = React.Children.map(children, (child) => <FormItem>{child}</FormItem>);

  return <AntdForm {...restProps}>{children || tg_dropPlaceholder}</AntdForm>;
};
