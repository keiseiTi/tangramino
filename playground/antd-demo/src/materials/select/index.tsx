import React from 'react';
import { Select as AntdSelect, type SelectProps } from 'antd';

export type IProps = SelectProps & {
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: number | string;
};

export const Select = (props: IProps) => {
  const {
    margin,
    padding,
    width,
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    style,
    ...restProps
  } = props;

  const customStyle = {
    minWidth: 120,
    margin,
    padding,
    width,
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    ...style,
  };

  return (
    <AntdSelect
      style={customStyle}
      {...restProps}
    />
  );
};
