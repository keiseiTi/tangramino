import React from 'react';
import type { MaterialComponentProps } from '@tangramino/base-editor';

export interface IProps extends MaterialComponentProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
  heightConfig?: 'fixed' | 'auto';
  height?: number | string;
}

export const Container = (props: IProps) => {
  const { children, margin, padding, heightConfig, height, tg_dropPlaceholder, ...rest } = props;

  const style: React.CSSProperties = {
    margin,
    padding,
  };

  if (heightConfig === 'auto') {
    style.flex = 1;
  } else {
    style.height = height || 200;
  }

  return (
    <div style={style} {...rest}>
      {children || tg_dropPlaceholder}
    </div>
  );
};
