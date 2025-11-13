import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useContextOptions } from '@/hooks/use-context-options';
import { HyperInput } from '@/components/hyper-input';

export const FormConfig = () => {
  const { globalVariableOptions } = useContextOptions();
  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.List name='setters' initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((filed, index) => (
              <div
                key={filed.key}
                className='relative border-1 border-dashed border-slate-300 rounded-sm px-2 pt-2 mb-2'
              >
                {index !== 0 && (
                  <div className='absolute -top-1 -right-1 z-10'>
                    <MinusCircleOutlined onClick={() => remove(filed.key)} />
                  </div>
                )}
                <Form.Item
                  name={[filed.name, 'name']}
                  label={<span className='text-xs'>选择全局变量</span>}
                >
                  <Select options={globalVariableOptions} />
                </Form.Item>
                <Form.Item
                  name={[filed.name, 'value']}
                  label={<span className='text-xs'>设置值</span>}
                >
                  <HyperInput />
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                添加全局变量设置
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};
