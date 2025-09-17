import React from 'react';
import { Button as AntdButton, type ButtonProps } from 'antd';

interface IProps extends ButtonProps {
  text?: string;
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number | string;
}

export const Button = (props: IProps) => {
  const {
    text,
    margin,
    padding,
    width,
    height,
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
    height,
    backgroundColor,
    borderColor,
    borderRadius,
    ...style,
  };

  return (
    <AntdButton style={customStyle} {...restProps}>
      {text}
    </AntdButton>
  );
};
