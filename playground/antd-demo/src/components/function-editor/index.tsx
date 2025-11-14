import React, { useEffect, useState } from 'react';
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
  const [params, setParams] = useState<Param[]>(
    value?.params || [{ name: undefined, value: undefined }],
  );

  useEffect(() => {
    if (open) {
      if (Array.isArray(value?.params) && value?.params.length) {
        setParams(value?.params);
      } else {
        setParams([{ name: undefined, value: undefined }]);
      }
      setCode(value?.body || '');
    }
  }, [value, open]);

  const onOk = () => {
    onChange?.({
      params: params.filter((param) => param.name),
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
        <div className='flex flex-col h-full overflow-hidden'>
          <ParamsSetter
            className='mb-2'
            style={{ height: 50 + (params.length - 1) * 40 }}
            value={params}
            onChange={setParams}
          />
          <div className='border border-solid border-gray-300 flex-1 overflow-hidden'>
            <CodeEditor
              value={code}
              onChange={onCodeChange}
              classNames='h-120'
              placeholder={`输入函数体逻辑 \n\n 例如：console.log("Hello world!");`}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
