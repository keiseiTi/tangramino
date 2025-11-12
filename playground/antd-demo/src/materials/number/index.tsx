import React, { useEffect, useState } from 'react';
import { InputNumber as AntdInputNumber, type InputNumberProps } from 'antd';

export type IProps = InputNumberProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Number = (props: IProps) => {
  const { margin, padding, value, onChange, ...restProps } = props;
  const [innerValue, setInnerValue] = useState<string | number | null>();

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleChange = (v: string | number | null) => {
    setInnerValue(v);
    onChange?.(v);
  };

  return (
    <AntdInputNumber
      style={{ margin, padding }}
      value={innerValue}
      onChange={handleChange}
      {...restProps}
    />
  );
};
