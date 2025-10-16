import React, { useState } from 'react';
import { Button } from 'antd';
import { Modal } from 'antd';
import { CodeEditor, type CodeEditorProps } from '../code-editor';

export const FunctionEditor = (props: CodeEditorProps) => {
  const { value, onChange } = props;
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(value as string);

  const onOk = () => {
    onChange?.(code);
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
        open={open}
        onOk={onOk}
        onCancel={() => setOpen(false)}
      >
        <div className='border border-solid border-gray-300 m-2'>
          <CodeEditor
            value={code}
            onChange={onCodeChange}
            classNames='h-112'
            placeholder={`输入函数体逻辑 \n\n 例如：console.log("Hello world!");`}
          />
        </div>
      </Modal>
    </>
  );
};
