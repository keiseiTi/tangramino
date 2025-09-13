import React from 'react';
import { Radio as AntdRadio, type RadioProps } from 'antd';

interface IProps extends RadioProps {
  label?: string;
  margin?: number | string;
  padding?: number | string;
}

export const Radio = (props: IProps) => {
  const { label, margin, padding, ...rest } = props;
  return (
    <AntdRadio
      style={{ margin, padding }}
      {...rest}
    >
      {label}
    </AntdRadio>
  );
};
