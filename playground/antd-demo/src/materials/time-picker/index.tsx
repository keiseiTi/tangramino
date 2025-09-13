import React from 'react';
import { TimePicker as AntdTimePicker, type TimePickerProps } from 'antd';

export type IProps = TimePickerProps & {
  margin?: number | string;
  padding?: number | string;
};

export const TimePicker = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdTimePicker
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
