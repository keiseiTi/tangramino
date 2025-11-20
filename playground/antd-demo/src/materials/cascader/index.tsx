import React from 'react';
import { Cascader as AntdCascader, type CascaderProps } from 'antd';

export type IProps = CascaderProps<any> & {
};

export const Cascader = (props: IProps) => {
  const { ...restProps } = props;
  return (
    <AntdCascader
      {...restProps}
    />
  );
};
