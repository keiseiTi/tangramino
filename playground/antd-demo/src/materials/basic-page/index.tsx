import React, { useLayoutEffect, useState } from 'react';
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
  const { children, margin, padding, tg_dropPlaceholder, display, flexDirection, ...rest } = props;
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const ele = document.querySelector('#canvasContainer');
    if (ele) {
      const rect = ele.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  const style: React.CSSProperties = {
    margin,
    padding,
    display: display === 'flex' ? 'flex' : undefined,
    height: height || '100%',
  };

  if (display === 'flex') {
    style.flexDirection = flexDirection;
  }

  return (
    <div className={cn('overflow-auto w-full')} style={style} {...rest}>
      {children || tg_dropPlaceholder}
    </div>
  );
};
