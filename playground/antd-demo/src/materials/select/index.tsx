import React from 'react';
import { Select as AntdSelect, type SelectProps } from 'antd';

export type IProps = SelectProps & {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: number | string;
};

export const Select = (props: IProps) => {
  const {
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    ...restProps
  } = props;

  return (
    <AntdSelect
      {...restProps}
    />
  );
};
