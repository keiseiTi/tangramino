import React, { useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import { useEditorCore } from '@tangramino/base-editor';
import { isPortal } from '@/utils';

export const FormConfig = () => {
  const { engine, materials, activeElement } = useEditorCore();

  const elements = engine.getElements();

  const filterSelfElements = useMemo(() => {
    return elements.filter((element) => isPortal(element.type));
  }, [elements, activeElement]);

  return (
    <>
      <Form.Item name='alias' label={<span className='text-xs'>节点别名</span>}>
        <Input />
      </Form.Item>
      <Form.Item
        name='elementId'
        label={<span className='text-xs'>选择元素</span>}
        help={<span className='text-xs'>选择要打开的弹窗(Modal)或抽屉(Drawer)元素</span>}
        rules={[{ required: true, message: '请选择元素' }]}
      >
        <Select
          options={filterSelfElements.map((element) => {
            return {
              label: `${materials.find((material) => material.type === element.type)?.title} (${element.id})`,
              value: element.id,
            };
          })}
        />
      </Form.Item>
    </>
  );
};
