import React, { useState } from 'react';
import { Draggable, type Material } from '@tangramino/base-editor';
import { cn } from '@/utils';
import { Collapse } from 'antd';

type MaterialGroup = {
  title: string;
  children: Material[];
};

export const MaterialPanel = (props: { materialGroups: MaterialGroup[] }) => {
  const { materialGroups } = props;
  const [activeKeys, setActiveKeys] = useState(['0', '1', '2', '3', '4', '5', '6']);

  return (
    <div className={cn('w-60 h-full overflow-auto select-none')}>
      <Collapse
        className='w-full'
        expandIconPosition='end'
        ghost
        defaultActiveKey={activeKeys}
        onChange={setActiveKeys}
        items={materialGroups?.map((group, index) => ({
          key: String(index),
          styles: {
            header: {
              padding: '6px 8px',
            },
            body: {
              padding: 8,
            },
          },
          classNames: {
            header: cn('border-b-1 border-gray-200', {
              'rounded-none!': index === materialGroups.length - 1,
            }),
            body: cn('flex flex-wrap gap-3', {
              'border-b-1 border-gray-200': index !== materialGroups.length - 1,
            }),
          },
          label: <div className='text-sm'>{group.title}</div>,
          children: group.children.map((material) => (
            <Draggable key={material.title as string} data={material}>
              <div className='w-25 h-8 text-xs flex justify-center items-center rounded-sm border border-slate-600 cursor-pointer hover:bg-zinc-100'>
                {material.title}
              </div>
            </Draggable>
          )),
        }))}
      />
    </div>
  );
};
