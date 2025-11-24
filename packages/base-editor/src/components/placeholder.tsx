import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Material } from '../interface/material';
import type { InsertPosition } from '../hooks/use-editor-core';

export interface DropPlaceholderProps {
  /**
   * 是否拖拽到了占位符上
   */
  isDragOver: boolean;
  /**
   * 拖拽到占位符上的物料
   */
  material: Material;
}

export interface PlaceholderProps {
  material: Material;
  elementProps: Record<string, unknown>;
  onSelected?: (e: React.MouseEvent) => void;
  renderDropPlaceholder?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined;
  insertPosition?: InsertPosition | null;
}

export const Placeholder = (props: PlaceholderProps) => {
  const { material, elementProps, onSelected, insertPosition, renderDropPlaceholder } = props;
  const { 'data-element-id': elementId, children, ...rest } = elementProps;
  void children;

  const { isOver, setNodeRef } = useDroppable({
    id: elementId + '-placeholder',
    data: {
      id: elementId,
      props: rest,
      position: insertPosition?.position,
      material,
    },
  });

  const selectedElement = (e: React.MouseEvent) => {
    onSelected?.(e);
  };

  return (
    <div ref={setNodeRef} onClick={selectedElement}>
      {renderDropPlaceholder
        ? renderDropPlaceholder({
            isDragOver: isOver,
            material,
          })
        : 'Please drag the material here'}
    </div>
  );
};
