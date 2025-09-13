import React from 'react';
import { Form as AntdForm, type FormProps } from 'antd';

export interface IProps extends FormProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number | string;
}

export const Form = (props: IProps) => {
  const {
    children,
    margin,
    padding,
    width,
    backgroundColor,
    borderColor,
    borderRadius,
    style,
    ...restProps
  } = props;

  const customStyle = {
    margin,
    padding,
    width,
    backgroundColor,
    borderColor,
    borderRadius,
    ...style,
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
