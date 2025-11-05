import React from 'react';
import { Form, Input } from 'antd';
import { HyperInput } from '@/components/hyper-input';

export const FormConfig = () => {
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.Item
        name='judgment'
        label={<span className='text-xs'>条件判断</span>}
        help={
          <div>
            <span className='text-xs'>返回值为 true，则执行条件为真分支</span>
            <br />
            <span className='text-xs'>返回值为 false，则执行条件为假分支</span>
          </div>
        }
      >
        <HyperInput showTypes={['expression', 'code']} />
      </Form.Item>
    </>
  );
};
