import React from 'react';
import { Switch as AntdSwitch, type SwitchProps } from 'antd';

export type IProps = SwitchProps & {
};

export const Switch = (props: IProps) => {
  const { ...restProps } = props;
  return (
    <AntdSwitch
      {...restProps}
    />
  );
};
