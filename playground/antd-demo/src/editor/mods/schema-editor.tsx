import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button, message } from 'antd';
import { useEditorCore } from '@tangramino/core';
import { CodeEditor } from '@/components/code-editor';
import type { Schema } from '@tangramino/engine';

export interface SchemaEditorProps {
  className?: string;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = (props) => {
  const { className } = props;
  const { engine, schema, setSchema } = useEditorCore();
  const [code, setCode] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const displaySchema = useMemo<Schema>(() => {
    try {
      return engine?.getSchema?.() || schema;
    } catch {
      return schema;
    }
  }, [engine, schema]);

  useEffect(() => {
    setCode(JSON.stringify(displaySchema, null, 2));
  }, [displaySchema]);

  const onSave = useCallback(async (): Promise<void> => {
    setSaving(true);
    try {
      const parsed = JSON.parse(code) as Schema;
      setSchema(parsed);
      message.success('Schema 已保存');
    } catch (e) {
      message.error('Schema JSON 解析失败，请检查格式');
    } finally {
      setSaving(false);
    }
  }, [code, setSchema]);

  return (
    <div className={className ? `h-full ${className}` : 'h-full'}>
      <div className='flex flex-col h-full'>
        <div className='flex-1'>
          <CodeEditor value={code} onChange={setCode} classNames='h-full' language='json' placeholder='编辑 Schema（JSON）' />
        </div>
        <div className='border-t border-gray-200 p-2 bg-gray-50 flex justify-end'>
          <Button type='primary' loading={saving} onClick={onSave}>
            保存 Schema
          </Button>
        </div>
      </div>
    </div>
  );
};
