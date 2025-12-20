import React, { useLayoutEffect, useState } from 'react';
import { cn } from '@/utils';
import { type DropPlaceholderProps } from '@tangramino/base-editor';

export const renderDropIndicator = (props: DropPlaceholderProps) => {
  const { material, isDragOver } = props;

  return (
    <div
      className={cn('w-full flex justify-center items-center transition-colors h-full', {
        'bg-slate-200 text-slate-600': material.type === 'container',
        'bg-stone-200 text-stone-600': material.type === 'form',
        'bg-gray-200 text-gray-600': !['container', 'form'].includes(material.type),
        'bg-blue-100': isDragOver,
      })}
    >
      <span>{`请将${material.type === 'form' ? '原子物料' : '物料'}拖拽到${material.title}内`}</span>
    </div>
  );
};
