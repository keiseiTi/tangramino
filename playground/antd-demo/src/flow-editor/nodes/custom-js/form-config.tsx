import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import type { RenderFormProps } from '@tangramino/flow-editor';

export const FormConfig = (props: RenderFormProps) => {
  const { title } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      alias: title,
    });
  }, [title]);

  return (
    <Form form={form}>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
    </Form>
  );
};