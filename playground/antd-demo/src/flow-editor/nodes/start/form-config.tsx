import React from 'react';
import { Form, Input } from 'antd';
import type { RenderFormProps } from '@tangramino/flow-editor';

export const FormConfig = (props: RenderFormProps) => {
  const { title } = props;

  return (
    <Form initialValues={{ alias: title }}>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
    </Form>
  );
};
