import React, { useState } from 'react';
import { Button } from 'antd';
import { Modal } from 'antd';
import { ParamsSetter } from './params-setter';
import { CodeEditor, type CodeEditorProps } from '../code-editor';
import type { Param } from '@/interfaces/custom-types';

export interface FunctionEditorProps extends Omit<CodeEditorProps, 'value' | 'onChange'> {
  value?: {
    params: Param[];
    body: string;
  };
  onChange?: (value: FunctionEditorProps['value']) => void;
}

export const FunctionEditor = (props: FunctionEditorProps) => {
  const { value, onChange } = props;
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string>(value?.body || '');
  const [params, setVariables] = useState<Param[]>(value?.params || []);

  const onOk = () => {
    onChange?.({
      params: params,
      body: code,
    });
    setOpen(false);
  };

  const onCodeChange = (code: string) => {
    setCode(code);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑代码</Button>
      <Modal
        title='代码编辑'
        width={800}
        classNames={{ body: 'h-120' }}
        destroyOnHidden={true}
        centered={true}
        open={open}
        onOk={onOk}
        onCancel={() => setOpen(false)}
      >
        <div className='flex flex-col'>
          <ParamsSetter className='mb-2' value={params} onChange={setVariables} />
          <div className='border border-solid border-gray-300'>
            <CodeEditor
              value={code}
              onChange={onCodeChange}
              classNames='h-100'
              placeholder={`输入函数体逻辑 \n\n 例如：console.log("Hello world!");`}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
