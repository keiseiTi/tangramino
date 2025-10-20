import React, { useState } from 'react';
import { useEditorCore } from '@tangramino/core';
import { Button, Radio, type RadioChangeEvent } from 'antd';
import { cn } from '@/utils';
import { useEditorContext } from '@/hooks/use-editor-context';
interface OperationProps {
  className?: string;
}
export const Operation = (props: OperationProps) => {
  const { className } = props;
  const { schema } = useEditorCore();
  const { mode, setMode } = useEditorContext();

  const onSave = () => {
    sessionStorage.setItem('schema', JSON.stringify(schema));
  };

  const onPreview = () => {
    window.open('/preview', '_blank');
  };

  const onModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  return (
    <div
      className={cn(
        'h-10 border-b border-gray-300 flex items-center px-2 justify-between',
        className,
      )}
    >
      <span className='text-lg font-medium'>Tangramino 低代码编辑器</span>
      <div>
        <Radio.Group optionType='button' buttonStyle='solid' value={mode} onChange={onModeChange}>
          <Radio value={'view'}>视图</Radio>
          <Radio value={'logic'}>逻辑</Radio>
        </Radio.Group>
      </div>
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
