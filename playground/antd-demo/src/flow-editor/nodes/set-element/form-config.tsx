import React from 'react';
import { Form, Input } from 'antd';
import { ElementSelect } from '@/flow-editor/mods/element-select';

export const FormConfig = () => {
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.Item name='elementId' label={<span className='text-xs'>选择元素</span>}>
        <ElementSelect />
      </Form.Item>
    </>
  );
};
