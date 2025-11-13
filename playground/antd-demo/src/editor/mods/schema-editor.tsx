import React, { useState, useCallback } from 'react';
import { Button, message } from 'antd';
import { useEditorCore } from '@tangramino/core';
import { CodeEditor } from '@/components/code-editor';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import { cn } from '@/utils';

export interface SchemaEditorProps {
  className?: string;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = (props) => {
  const { className } = props;
  const { schema, setSchema } = useEditorCore();
  const [code, setCode] = useState<string>(JSON.stringify(schema, null, 2));

  const onSave = useCallback(() => {
    try {
      const parsed = JSON.parse(code) as Schema;
      setSchema(SchemaUtils.normalizeSchema(parsed));
      message.success('Schema 已保存');
    } catch (e) {
      message.error('Schema JSON 解析失败，请检查格式');
    }
  }, [code, setSchema]);

  return (
    <div className={cn('h-full', className)}>
      <div className='flex flex-col h-full'>
        <div className='flex-1'>
          <CodeEditor
            value={code}
            onChange={setCode}
            classNames='h-full'
            language='json'
            placeholder='编辑 Schema（JSON）'
          />
        </div>
        <div className='border-t border-gray-200 p-2 bg-gray-50 flex justify-end'>
          <Button type='primary' onClick={onSave}>
            保存 Schema
          </Button>
        </div>
      </div>
    </div>
  );
};
