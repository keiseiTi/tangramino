import React, { useEffect } from 'react';
import { useEditorContext } from '@tangramino/flow-editor';
import { Form, type FormInstance } from 'antd';

export const AttributePanel = () => {
  const { activeNode } = useEditorContext();
  const [form] = Form.useForm();

  useEffect(() => {
    if (activeNode) {
      form.resetFields();
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
    <div className='w-70 bg-white border-l border-gray-200 flex flex-col shadow-sm'>
      <div className='h-9.5 px-3 flex items-center text-slate-800 border-b border-gray-200 text-sm'>
        {activeNode?.title || activeNode?.type || '节点配置'}
      </div>
      {activeNode ? (
        <div className='flex-1 p-3 overflow-auto'>
          <Form form={form} onValuesChange={onValuesChange}>
            <FormItems form={form} />
          </Form>
        </div>
      ) : (
        <div className='flex-1 flex justify-center items-center'>
          <span>请从左侧画布中选中节点</span>
        </div>
      )}
    </div>
  );
};
