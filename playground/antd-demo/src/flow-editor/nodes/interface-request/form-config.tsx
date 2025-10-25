import React from 'react';
import { Form, Input, Select } from 'antd';
import { HyperInput } from '@/components/hyper-input';

export const FormConfig = () => {
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.Item name='url' label={<span className='text-xs'>请求 URL</span>}>
        <HyperInput showTypes={['string', 'expression', 'code']} />
      </Form.Item>
      <Form.Item name='method' label={<span className='text-xs'>请求方法</span>}>
        <Select
          options={[
            { label: 'GET', value: 'get' },
            { label: 'POST', value: 'post' },
            { label: 'DELETE', value: 'delete' },
            { label: 'PUT', value: 'put' },
            { label: 'PATCH', value: 'patch' },
          ]}
        />
      </Form.Item>
      <Form.Item name='headers' label={<span className='text-xs'>请求头参数</span>}>
        <HyperInput showTypes={['code']} />
      </Form.Item>
      <Form.Item name='queryParams' label={<span className='text-xs'>查询参数</span>}>
        <HyperInput showTypes={['code']} />
      </Form.Item>
      <Form.Item name='bodyParams' label={<span className='text-xs'>请求体参数</span>}>
        <HyperInput showTypes={['code']} />
      </Form.Item>
    </>
  );
};
