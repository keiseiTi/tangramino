import React from 'react';
import { InputNumber as AntdInputNumber, type InputNumberProps } from 'antd';

export type IProps = InputNumberProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Number = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return <AntdInputNumber style={{ margin, padding }} {...restProps} />;
};
