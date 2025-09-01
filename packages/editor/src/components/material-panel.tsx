import React, { useMemo } from 'react';
import { cn } from '../utils';
import DraggableMaterial from './draggable-material';
import type { Material } from '../interface/material';

interface MaterialGroupProps {
  materials?: Material[];
  className?: string;
}

export const MaterialPanel = (props: MaterialGroupProps) => {
  const { materials, className } = props;

  const { materialList, materialGroupList } = useMemo(() => {
    if (Array.isArray(materials)) {
      const materialList = materials.filter((_) => !_.isGroup);
      const materialGroupList = materials.filter((_) => _.isGroup);
      return {
        materialList: materialList,
        materialGroupList: materialGroupList,
      };
    }
    return {
      materialList: [],
      materialGroupList: [],
    };
  }, [materials]);

  return (
    <div
      className={cn('w-62 border-r-1 border-gray-200 h-full p-4', className)}
    >
      <div className='flex flex-wrap gap-4'>
        {materialGroupList.map((group) => (
          <div key={group.title as string}>
            <div>
              <span>{group.title}</span>
            </div>
            {group.children?.map((material) => (
              <DraggableMaterial
                key={material.title as string}
                data={material}
                className='w-24 h-8 text-sm flex justify-center items-center rounded-sm border border-slate-600 cursor-pointer hover:bg-zinc-50'
              />
            ))}
          </div>
        ))}
        {materialList.map((material) => (
          <DraggableMaterial
            key={material.title as string}
            data={material}
            className='w-24 h-8 text-sm flex justify-center items-center rounded-sm border border-slate-600 cursor-pointer hover:bg-zinc-100'
          />
        ))}
      </div>
    </div>
  );
};
