import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';

type AntdCheckboxGroupProps = typeof AntdCheckbox.Group;
interface IProps extends AntdCheckboxGroupProps {
  label?: string;
  margin?: number | string;
  padding?: number | string;
}

export const Checkbox = (props: IProps) => {
  const { label, margin, padding, ...rest } = props;
  return <AntdCheckbox.Group style={{ margin, padding }} {...rest}></AntdCheckbox.Group>;
};
