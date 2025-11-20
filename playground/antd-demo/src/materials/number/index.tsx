import React, { useEffect, useState } from 'react';
import { InputNumber as AntdInputNumber, type InputNumberProps } from 'antd';

export type IProps = InputNumberProps & {
};

export const Number = (props: IProps) => {
  const { value, onChange, ...restProps } = props;
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
      value={innerValue}
      onChange={handleChange}
      {...restProps}
    />
  );
};
