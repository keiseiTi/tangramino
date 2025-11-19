import React from 'react';
import { Radio as AntdRadio, type RadioProps } from 'antd';

interface IProps extends RadioProps {
  label?: string;
  margin?: number | string;
  padding?: number | string;
  optionDisplayButton?: boolean;
}

export const Radio = (props: IProps) => {
  const { label, margin, padding, optionDisplayButton, ...rest } = props;

  if (optionDisplayButton) {
    return (
      <AntdRadio.Group
        style={{ margin, padding }}
        optionType='button'
        buttonStyle='solid'
        {...rest}
      >
        {label}
      </AntdRadio.Group>
    );
  }

  return (
    <AntdRadio.Group style={{ margin, padding }} {...rest}>
      {label}
    </AntdRadio.Group>
  );
};
