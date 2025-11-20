import React, { useEffect, useState } from 'react';
import { Input as AntdInput, type InputProps } from 'antd';

export type IProps = InputProps & {
  value?: string;
};

export const Input = (props: IProps) => {
  const { onChange, value, ...restProps } = props;
  const [innerValue, setInnerValue] = useState<string>();

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
    onChange?.(e);
  };

  return (
    <AntdInput value={innerValue} onChange={handleChange} {...restProps} />
  );
};
