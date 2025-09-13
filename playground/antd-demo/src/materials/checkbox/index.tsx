import React from 'react';
import { Checkbox as AntdCheckbox, type CheckboxProps } from 'antd';

interface IProps extends CheckboxProps {
  label?: string;
  margin?: number | string;
  padding?: number | string;
}

export const Checkbox = (props: IProps) => {
  const { label, margin, padding, ...rest } = props;
  return (
    <AntdCheckbox
      style={{ margin, padding }}
      {...rest}
    >
      {label}
    </AntdCheckbox>
  );
};
