import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { HyperInput } from '@/components/hyper-input';
import { ElementSelect } from '@/flow-editor/mods/element-select';
import { useEditorCore } from '@tangramino/core';

export const FormConfig = () => {
  const { engine, materials } = useEditorCore();
  const [propList, setPropList] = useState<
    {
      name: string;
      description?: string;
    }[]
  >([]);

  const onSelectedElement = (elementId?: string | string[]) => {
    const element = engine.elements[elementId as string];
    const material = materials.find((material) => material.type === element.type);
    setPropList(material?.contextConfig?.variables || []);
  };

  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.List name='setter' initialValue={[{}]}>
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
                  name={[filed.name, 'propName']}
                  label={<span className='text-xs'>选择属性</span>}
                >
                  <Select
                    options={propList.map((item) => ({
                      label: item.description,
                      value: item.name,
                    }))}
                  />
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
                添加元素属性设置
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};
