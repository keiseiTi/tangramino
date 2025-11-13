import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Material } from '../interface/material';

interface MoveProps {
  elementId: string;
  elementProps: Record<string, unknown>;
  material: Material;
}

export const useMove = (props: MoveProps) => {
  const { elementId, elementProps, material } = props;
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

  const MoveElement = (props: { children: React.ReactNode; className?: string }) => {
    const { children, className } = props;
    return (
      <div ref={setMoveNodeRef} {...listeners} {...attributes} className={className}>
        {children}
      </div>
    );
  };

  return MoveElement;
};
