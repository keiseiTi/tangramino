import React from 'react';
import { Button as AntdButton, type ButtonProps } from 'antd';
import type { MaterialComponentProps } from '@tangramino/base-editor';

interface IProps extends ButtonProps, MaterialComponentProps {
  text?: string;
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
}

export const Button = (props: IProps) => {
  const { text, margin, padding, width, height, style, onClick, ...restProps } = props;
  const customStyle = {
    margin,
    padding,
    width,
    height,
    ...style,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.tg_mode !== 'render') {
      e.preventDefault();
    }
    onClick?.(e);
  };

  return (
    <AntdButton style={customStyle} {...restProps} onClick={handleClick}>
      {text}
    </AntdButton>
  );
};
