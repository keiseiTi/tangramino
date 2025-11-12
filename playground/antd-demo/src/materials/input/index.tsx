import React, { useEffect, useState } from 'react';
import { Input as AntdInput, type InputProps } from 'antd';

export type IProps = InputProps & {
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
  value?: string;
};

export const Input = (props: IProps) => {
  const { margin, padding, width, height, style, onChange, value, ...restProps } = props;
  const [innerValue, setInnerValue] = useState<string>();

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
    onChange?.(e);
  };

  const customStyle = {
    margin,
    padding,
    width,
    height,
    ...style,
  };

  return (
    <AntdInput style={customStyle} value={innerValue} onChange={handleChange} {...restProps} />
  );
};
