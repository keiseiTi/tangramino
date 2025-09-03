import React from 'react';
import { cn } from '../utils';
import { useDroppable } from '@dnd-kit/core';
import type { Material } from '../interface/material';

export interface PlaceholderProps {
  material: Material;
  elementProps: Record<string, unknown>;
  onSelected: (e: React.MouseEvent) => void;
}
export const Placeholder = (props: PlaceholderProps) => {
  const { material, elementProps, onSelected } = props;
  const { 'data-element-id': elementId, children, ...rest } = elementProps;

  const { isOver, setNodeRef } = useDroppable({
    id: elementId + '-placeholder',
    data: {
      id: elementId,
      props: rest,
    },
  });

  const selectedElement = (e: React.MouseEvent) => {
    onSelected(e);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={selectedElement}
      className={cn('w-full h-50 flex justify-center text-gray-500 items-center bg-gray-200 transition-colors', {
        'bg-blue-100': isOver,
        'h-full': material.type !== 'basicPage',
      })}
    >
      <span>请将物料拖拽到此处</span>
    </div>
  );
};
