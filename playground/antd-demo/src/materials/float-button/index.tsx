import React from 'react';
import { FloatButton, type FloatButtonProps } from 'antd';

export type IProps = FloatButtonProps & {
  margin?: number | string;
  padding?: number | string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: number | string;
};

export const FloatButtonComponent = (props: IProps) => {
  const {
    margin,
    padding,
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
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    ...style,
  };

  return (
    <FloatButton
      style={customStyle}
      {...restProps}
    />
  );
};
