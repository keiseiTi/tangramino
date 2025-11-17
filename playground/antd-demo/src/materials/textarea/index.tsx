import React, { useEffect, useState } from 'react';
import { Input as AntdInput } from 'antd';
import type { MaterialComponentProps } from '@tangramino/base-editor';

export type IProps = MaterialComponentProps & {
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
};

export const Textarea = (props: IProps) => {
  const { margin, padding, width, height, onChange, value, ...restProps } = props;
  const [innerValue, setInnerValue] = useState<string>();

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInnerValue(e.target.value);
    onChange?.(e);
  };

  const customStyle = {
    margin,
    padding,
    width,
    height,
  };

  return (
    <AntdInput.TextArea
      style={customStyle}
      value={innerValue}
      onChange={handleChange}
      {...restProps}
    />
  );
};
