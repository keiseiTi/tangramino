import React from 'react';
import { Form, Input } from 'antd';

export const FormConfig = () => {
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
    </>
  );
};
