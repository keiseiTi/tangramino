import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useEditorCore } from 'src/hooks/use-editor-core';

interface MovableProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Movable = (props: MovableProps) => {
  const { children, className, onClick } = props;
  const activeElement = useEditorCore((state) => state.activeElement);
  const { id, props: elementProps, material } = activeElement || {};
  const {
    setNodeRef: setMoveNodeRef,
    listeners,
    attributes,
  } = useDraggable({
    id: id + '-move',
    data: {
      id: id,
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
