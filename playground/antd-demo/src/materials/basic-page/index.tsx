import React from 'react';
import { cn } from '@/utils/cn';
import type { MaterialComponentProps } from '@tangramino/base-editor';

interface BasicPageProps extends MaterialComponentProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
  display?: 'stream' | 'flex';
  flexDirection?: 'row' | 'column';
}

export const BasicPage = (props: BasicPageProps) => {
  const { children, margin, padding, tg_dropPlaceholder, tg_ref, display, flexDirection, ...rest } =
    props;

  const style: React.CSSProperties = {
    margin,
    padding,
    display: display === 'flex' ? 'flex' : undefined,
    height: '100%',
  };

  if (display === 'flex') {
    style.flexDirection = flexDirection;
  }

  return (
    <div ref={tg_ref} className={cn('overflow-auto w-full')} style={style} {...rest}>
      {children || tg_dropPlaceholder}
    </div>
  );
};
