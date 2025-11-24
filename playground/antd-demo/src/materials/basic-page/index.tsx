import React from 'react';
import { cn } from '@/utils/cn';
import type { MaterialComponentProps } from '@tangramino/base-editor';

interface BasicPageProps extends MaterialComponentProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
}

export const BasicPage = (props: BasicPageProps) => {
  const { children, margin, padding, tg_dropPlaceholder } = props;

  return (
    <div className={cn('overflow-auto h-full w-full')} style={{ margin, padding }}>
      {children || tg_dropPlaceholder}
    </div>
  );
};
