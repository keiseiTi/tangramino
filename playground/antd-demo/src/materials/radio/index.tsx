import React from 'react';
import { Radio as AntdRadio, type RadioProps } from 'antd';

interface IProps extends RadioProps {
  label?: string;
  optionDisplayButton?: boolean;
}

export const Radio = (props: IProps) => {
  const { label, optionDisplayButton, ...rest } = props;

  if (optionDisplayButton) {
    return (
      <AntdRadio.Group
        optionType='button'
        buttonStyle='solid'
        {...rest}
      >
        {label}
      </AntdRadio.Group>
    );
  }

  return (
    <AntdRadio.Group {...rest}>
      {label}
    </AntdRadio.Group>
  );
};
