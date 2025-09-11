import React from 'react';
import { cn } from '../utils';
import { type DropPlaceholderProps } from '@tangramino/core';

export const CustomDropPlaceholder = (props: DropPlaceholderProps) => {
  const { material, isOver } = props;

  return (
    <div
      className={cn(
        'w-full h-50 flex justify-center text-gray-500 items-center bg-gray-200 transition-colors',
        {
          'bg-blue-100': isOver,
          'h-full': material.type !== 'basicPage',
        },
      )}
    >
      <span>请将物料拖拽到此处</span>
    </div>
  );
};
