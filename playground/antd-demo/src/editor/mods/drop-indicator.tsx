import React from 'react';
import { cn } from '@/utils';
import { type DropPlaceholderProps } from '@tangramino/base-editor';

export const DropIndicator = (props: DropPlaceholderProps) => {
  const { material, isDragOver } = props;

  return (
    <div
      className={cn(
        'w-full flex justify-center items-center transition-colors h-50 bg-gray-200 text-gray-600',
        {
          'bg-blue-100': isDragOver,
        },
      )}
    >
      <span>{`请将物料拖拽到${material.title}内`}</span>
    </div>
  );
};
