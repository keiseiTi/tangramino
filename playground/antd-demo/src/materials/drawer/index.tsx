import React from 'react';
import { Drawer as AntdDrawer, type DrawerProps } from 'antd';

export type IProps = DrawerProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Drawer = (props: IProps) => {
  const { children, margin, padding, ...restProps } = props;
  return (
    <AntdDrawer
      style={{ margin, padding }}
      {...restProps}
    >
      {children}
    </AntdDrawer>
  );
};
