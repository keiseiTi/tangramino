import React from 'react';
import { Switch as AntdSwitch, type SwitchProps } from 'antd';

export type IProps = SwitchProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Switch = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdSwitch
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
