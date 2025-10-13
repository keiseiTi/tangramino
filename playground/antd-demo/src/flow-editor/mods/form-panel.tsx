import React, { useEffect } from 'react';
import { useEditorContext } from '@tangramino/flow-editor';
import { Form } from 'antd';

export const FormPanel = () => {
  const { activeNode } = useEditorContext();
  const [form] = Form.useForm();

  useEffect(() => {
    if (activeNode) {
      form.setFieldsValue({
        alias: activeNode.title,
        ...activeNode.data,
      });
    }
  }, [activeNode]);

  const onValuesChange = (changedValues: Record<string, unknown>) => {
    activeNode?.updateData(changedValues);
  };

  return (
    <div className='w-60 bg-gray-50 flex flex-col'>
      <div className='p-2 text-slate-800 border-b border-slate-300'>
        {activeNode?.title || activeNode?.type || '节点配置'}
      </div>
      {activeNode ? (
        <div className='flex-1 p-2'>
          <Form form={form} onValuesChange={onValuesChange}>
            {activeNode?.renderForm?.(activeNode)}
          </Form>
        </div>
      ) : (
        <div className='flex-1 flex justify-center items-center text-xs'>
          <span>请选择节点</span>
        </div>
      )}
    </div>
  );
};
