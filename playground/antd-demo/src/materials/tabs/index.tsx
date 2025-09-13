import React from 'react';
import { Tabs as AntdTabs, type TabsProps } from 'antd';

export type IProps = TabsProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Tabs = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdTabs
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
