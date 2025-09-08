import React from 'react';
import { cn } from '../utils';
import { useEditorStore, Draggable } from '@tangramino/base-editor';

export const MaterialPanel = () => {
  const { materials } = useEditorStore();

  return (
    <div className={cn('w-62 border-r-1 border-gray-200 h-full p-4')}>
      <div className='flex flex-wrap gap-4'>
        {materials.map((material) => (
          <Draggable key={material.title as string} data={material}>
            <div className='w-24 h-8 text-sm flex justify-center items-center rounded-sm border border-slate-600 cursor-pointer hover:bg-zinc-100'>
              {material.title}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};
