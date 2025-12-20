import React from 'react';
import { Button as AntdButton, type ButtonProps } from 'antd';

interface IProps extends ButtonProps {
  text?: string;
}

export const Button = (props: IProps) => {
  const { text, ...restProps } = props;

  return <AntdButton {...restProps}>{text}</AntdButton>;
};
