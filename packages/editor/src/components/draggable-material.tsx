import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Material } from '../interface/material';

interface MaterialMaterialProps {
  className?: string;
  data: Material;
}

const DraggableMaterial = (props: MaterialMaterialProps) => {
  const { data, className } = props;
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: data.type + '-draggable',
    data: data,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={className}>
      <span className='text-store-600'>{data.title}</span>
    </div>
  );
};

export default DraggableMaterial;
