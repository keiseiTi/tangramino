import React from 'react';
import { useEditorStore } from '@tangramino/core';
import { Button } from 'antd';
import { cn } from '../utils';
interface OperationProps {
  className?: string;
}
export const Operation = (props: OperationProps) => {
  const { className } = props;
  const { schema } = useEditorStore();

  const onSave = () => {
    sessionStorage.setItem('schema', JSON.stringify(schema));
  };

  const onPreview = () => {
    // window.open('/preview', '_blank');
    // TODO
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
        <Button size='small' type='primary' onClick={onPreview} className='mr-2'>
          预览
        </Button>
        <Button size='small' type='primary' ghost onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  );
};
