import React from 'react';
import type { MaterialComponentProps } from '@tangramino/base-editor';

export interface IProps extends MaterialComponentProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
}

export const Container = (props: IProps) => {
  const { children, margin, padding, tg_dropPlaceholder } = props;
  return (
    <div style={{ margin, padding }}>
      {children}
      {tg_dropPlaceholder}
    </div>
  );
};
