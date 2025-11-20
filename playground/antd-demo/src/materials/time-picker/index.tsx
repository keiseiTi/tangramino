import React from 'react';
import { TimePicker as AntdTimePicker, type TimePickerProps } from 'antd';

export type IProps = TimePickerProps & {
};

export const TimePicker = (props: IProps) => {
  const { ...restProps } = props;
  return (
    <AntdTimePicker
      {...restProps}
    />
  );
};
