import React from 'react';
import type { MaterialComponentProps } from '@tangramino/base-editor';

export interface IProps extends MaterialComponentProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
  height?: number | string;
}

export const Container = (props: IProps) => {
  const { children, margin, padding, height, tg_dropPlaceholder } = props;

  const style: React.CSSProperties = {
    margin,
    padding,
    height,
  };

  return (
    <div style={style} className='h-25'>
      {children || tg_dropPlaceholder}
    </div>
  );
};
