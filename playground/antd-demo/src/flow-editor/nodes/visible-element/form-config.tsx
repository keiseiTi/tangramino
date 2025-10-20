import React from 'react';
import { Form, Input } from 'antd';
import { ElementSelect } from '@/flow-editor/mods/element-select';
import { HyperInput } from '@/components/hyper-input';

export const FormConfig = () => {
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.Item name='elementIds' label={<span className='text-xs'>选择元素</span>}>
        <ElementSelect />
      </Form.Item>
      <Form.Item
        name='value'
        label={<span className='text-xs'>显隐设置</span>}
        help={<span className='text-xs'>设置元素的可见性，true 为可见，false 为隐藏</span>}
      >
        <HyperInput showTypes={['boolean', 'code']} />
      </Form.Item>
    </>
  );
};
