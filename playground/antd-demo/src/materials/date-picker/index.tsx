import React from 'react';
import { DatePicker as AntdDatePicker, type DatePickerProps } from 'antd';

export type IProps = DatePickerProps & {
};

export const DatePicker = (props: IProps) => {
  const { ...restProps } = props;
  return (
    <AntdDatePicker
      {...restProps}
    />
  );
};
