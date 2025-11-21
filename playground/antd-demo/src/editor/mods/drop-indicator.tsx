import React from 'react';
import { cn } from '@/utils';
import { type DropPlaceholderProps } from '@tangramino/base-editor';

export const DropIndicator = (props: DropPlaceholderProps) => {
  const { material, isDragOver } = props;

  return (
    <div
      className={cn('w-full flex justify-center items-center transition-colors', {
        'bg-blue-100': isDragOver,
        'h-50 bg-gray-200 text-gray-600': material.type === 'basicPage',
        'h-25 bg-slate-200 text-slate-600': material.type !== 'basicPage',
      })}
    >
      <span>{`请将物料拖拽到${material.title}内`}</span>
    </div>
  );
};
