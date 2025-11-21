import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Material } from '../interface/material';

interface DraggableProps {
  material: Material;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isTransform?: boolean;
}

export const Draggable = (props: DraggableProps) => {
  const { material, className, children, style, isTransform = false } = props;
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: material.type + '-draggable',
    data: material,
  });

  const inlineStyle =
    isTransform && transform
      ? {
          ...style,
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : style;

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={className} style={inlineStyle}>
      {children}
    </div>
  );
};
