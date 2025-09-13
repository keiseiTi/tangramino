import React from 'react';
import { Cascader as AntdCascader, type CascaderProps } from 'antd';

export type IProps = CascaderProps<any> & {
  margin?: number | string;
  padding?: number | string;
};

export const Cascader = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdCascader
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
