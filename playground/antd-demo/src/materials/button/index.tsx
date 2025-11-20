import React from 'react';
import { Button as AntdButton, type ButtonProps } from 'antd';
import type { MaterialComponentProps } from '@tangramino/base-editor';

interface IProps extends ButtonProps, MaterialComponentProps {
  text?: string;
}

export const Button = (props: IProps) => {
  const { text, onClick, ...restProps } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.tg_mode !== 'render') {
      e.preventDefault();
    }
    onClick?.(e);
  };

  return (
    <AntdButton {...restProps} onClick={handleClick}>
      {text}
    </AntdButton>
  );
};
