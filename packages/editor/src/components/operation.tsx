import React from 'react';
import { cn } from '../utils';
import { Button } from './ui/button';
import { useEditorStore } from '../hooks/editor';

interface OperationProps {
  className?: string;
}
export const Operation = (props: OperationProps) => {
  const { className } = props;
  const { schema } = useEditorStore();

  const onSave = () => {
    sessionStorage.setItem('schema', JSON.stringify(schema));
  };

  return (
    <div
      className={cn(
        'h-10 border-b border-gray-300 flex items-center px-4 justify-between',
        className,
      )}
    >
      <span className='text-lg font-medium text-blue-900'>Tangramino 低代码编辑器</span>

      <div>
        <Button className='cursor-pointer' size={'sm'} onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  );
};
