import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

interface IProps extends RangePickerProps {}

export const DatePickerRange = (props: IProps) => {
  const { ...restProps } = props;
  return <AntdDatePicker.RangePicker {...props} />;
};
