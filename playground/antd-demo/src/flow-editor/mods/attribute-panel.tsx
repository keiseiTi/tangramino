import React, { useEffect } from 'react';
import { useEditorContext } from '@tangramino/flow-editor';
import { Form, type FormInstance } from 'antd';

export const AttributePanel = () => {
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

  const onValuesChange = (_: Record<string, unknown>, values: Record<string, unknown>) => {
    activeNode?.updateData({
      ...values,
    });
  };

  const FormItems =
    activeNode?.renderForm || ((() => null) as (props: { form: FormInstance }) => React.ReactNode);

  return (
    <div className='w-60 bg-gray-50 flex flex-col'>
      <div className='p-2 text-slate-800 border-b border-slate-300 text-sm'>
        {activeNode?.title || activeNode?.type || '节点配置'}
      </div>
      {activeNode ? (
        <div className='flex-1 p-2'>
          <Form form={form} onValuesChange={onValuesChange}>
            <FormItems form={form} />
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
