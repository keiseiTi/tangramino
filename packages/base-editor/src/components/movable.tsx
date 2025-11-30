import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Material } from '../interface/material';

interface MovableProps {
  elementId: string;
  elementProps: Record<string, unknown>;
  material: Material;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Movable = (props: MovableProps) => {
  const { elementId, elementProps, material, children, className, onClick } = props;
  const {
    setNodeRef: setMoveNodeRef,
    listeners,
    attributes,
  } = useDraggable({
    id: elementId + '-move',
    data: {
      id: elementId,
      props: elementProps,
      material: material,
    },
  });

  return (
    <div
      ref={setMoveNodeRef}
      {...listeners}
      {...attributes}
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
