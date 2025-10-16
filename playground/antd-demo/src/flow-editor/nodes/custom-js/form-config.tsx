import React from 'react';
import { Form, Input } from 'antd';
import { HyperInput } from '@/components/hyper-input';

export const FormConfig = () => {
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.Item name='code' label={<span className='text-xs'>自定义代码</span>}>
        <HyperInput showTypes={['code']} />
      </Form.Item>
    </>
  );
};
