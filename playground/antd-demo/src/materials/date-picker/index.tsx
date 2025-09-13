import React from 'react';
import { DatePicker as AntdDatePicker, type DatePickerProps } from 'antd';

export type IProps = DatePickerProps & {
  margin?: number | string;
  padding?: number | string;
};

export const DatePicker = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdDatePicker
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
