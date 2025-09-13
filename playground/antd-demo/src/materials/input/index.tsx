import React from 'react';
import { Input as AntdInput, type InputProps } from 'antd';

export type IProps = InputProps & {
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: number | string;
};

export const Input = (props: IProps) => {
  const {
    margin,
    padding,
    width,
    height,
    backgroundColor,
    color,
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
    color,
    borderColor,
    borderRadius,
    ...style,
  };

  return (
    <AntdInput
      style={customStyle}
      {...restProps}
    />
  );
};
