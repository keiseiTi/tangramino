import React from 'react';
import { Drawer as AntdDrawer, type DrawerProps } from 'antd';

export type IProps = DrawerProps & {
};

export const Drawer = (props: IProps) => {
  const { children, ...restProps } = props;
  return (
    <AntdDrawer
      {...restProps}
    >
      {children}
    </AntdDrawer>
  );
};
