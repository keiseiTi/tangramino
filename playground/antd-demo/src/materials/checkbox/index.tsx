import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';

type AntdCheckboxGroupProps = typeof AntdCheckbox.Group;
interface IProps extends AntdCheckboxGroupProps {
  label?: string;
}

export const Checkbox = (props: IProps) => {
  const { label, ...rest } = props;
  return <AntdCheckbox.Group {...rest}></AntdCheckbox.Group>;
};
