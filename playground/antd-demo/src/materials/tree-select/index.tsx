import React from 'react';
import { TreeSelect as AntdTreeSelect, type TreeSelectProps } from 'antd';

export type IProps = TreeSelectProps & {
  margin?: number | string;
  padding?: number | string;
};

export const TreeSelect = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdTreeSelect
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
