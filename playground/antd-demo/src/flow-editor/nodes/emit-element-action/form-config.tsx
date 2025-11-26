import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ElementSelect } from '@/flow-editor/mods/element-select';
import { useEditorCore } from '@tangramino/base-editor';
import { HyperInput } from '@/components/hyper-input';

export const FormConfig = () => {
  const { engine, materials } = useEditorCore();
  const [methodList, setMethodList] = useState<
    {
      name: string;
      description?: string;
    }[]
  >([]);

  const onSelectedElement = (elementId?: string | string[]) => {
    const element = engine.elements[elementId as string];
    const material = materials.find((material) => material.type === element.type);
    setMethodList((material?.contextConfig?.contextValues || []).filter(_ => _.isMethod));
  };
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
                  name={[filed.name, 'elementId']}
                  label={<span className='text-xs'>选择元素</span>}
                >
                  <ElementSelect onChange={onSelectedElement} />
                </Form.Item>
                <Form.Item
                  name={[filed.name, 'methodName']}
                  label={<span className='text-xs'>选择方法</span>}
                >
                  <Select
                    options={methodList.map((item) => ({
                      label: item.description,
                      value: item.name,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name={[filed.name, 'value']}
                  label={<span className='text-xs'>设置参数</span>}
                >
                  <HyperInput />
                </Form.Item>
              </div>
            ))}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                添加触发元素方法
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};
