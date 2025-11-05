import React from 'react';
import { useNodeContext } from '@tangramino/flow-editor';
import { cn } from '@/utils/cn';

interface BaseNodeRenderProps {
  title?: string;
  className?: string;
}

export const BaseNodeRender = (props: BaseNodeRenderProps) => {
  const { selected, data } = useNodeContext();

  return (
    <div
      className={cn(
        'w-20 p-2 bg-blue-500 text-white flex justify-center items-center rounded-4',
        props.className,
      )}
    >
      {data?.alias || props.title}
    </div>
  );
};
