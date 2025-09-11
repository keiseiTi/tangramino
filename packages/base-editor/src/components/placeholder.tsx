import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Material } from '../interface/material';

export interface DropPlaceholderProps {
  isOver: boolean;
  material: Material;
}

export interface PlaceholderProps {
  material: Material;
  elementProps: Record<string, unknown>;
  onSelected: (e: React.MouseEvent) => void;
  renderDropPlaceholder?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined;
}

export const Placeholder = (props: PlaceholderProps) => {
  const { material, elementProps, onSelected, renderDropPlaceholder } = props;
  const { 'data-element-id': elementId, children, ...rest } = elementProps;
  void children;

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
    <div ref={setNodeRef} onClick={selectedElement}>
      {renderDropPlaceholder
        ? renderDropPlaceholder({ isOver, material })
        : 'Please drag the material here'}
    </div>
  );
};
