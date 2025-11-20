import React from 'react';
import { Form as AntdForm, type FormProps } from 'antd';

export interface IProps extends FormProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number | string;
}

export const Form = (props: IProps) => {
  const {
    children,
    backgroundColor,
    borderColor,
    borderRadius,
    ...restProps
  } = props;

  const customStyle = {
    backgroundColor,
    borderColor,
    borderRadius,
  };

  return (
    <AntdForm
      style={customStyle}
      {...restProps}
    >
      {children}
    </AntdForm>
  );
};
