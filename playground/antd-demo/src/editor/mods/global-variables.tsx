import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button, Form, Input, Select, Space, Switch, message, Popconfirm } from 'antd';
import { useEditorCore } from '@tangramino/core';
import { cn } from '@/utils';
import { MinusCircleOutlined } from '@ant-design/icons';
import { SchemaUtils } from '@tangramino/engine';

export type GlobalVariableType = 'number' | 'string' | 'bool' | 'object' | 'array';

export interface GlobalVariable {
  name: string;
  description: string;
  type: GlobalVariableType;
  defaultValue: number | string | boolean;
}

export interface GlobalVariablesPanelProps {
  className?: string;
}

const typeOptions: { label: string; value: GlobalVariableType }[] = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔值', value: 'bool' },
  { label: '对象', value: 'object' },
  { label: '数组', value: 'array' },
];

const useInitialGlobals = (): GlobalVariable[] => {
  const { schema } = useEditorCore();
  return useMemo<GlobalVariable[]>(() => {
    const raw = SchemaUtils.getGlobalVariables(schema) || [];
    return raw.map((v) => ({
      name: v.name,
      description: v.description ?? '',
      type: 'string',
      defaultValue: '',
    }));
  }, [schema]);
};

const DefaultValueField: React.FC<{
  type: GlobalVariableType;
  value?: unknown;
  onChange: (v: unknown) => void;
}> = (props) => {
  const { type, value, onChange } = props;

  if (type === 'number') {
    return (
      <Input
        type='number'
        value={typeof value === 'number' ? value : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }
  if (type === 'string') {
    return (
      <Input
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (type === 'bool') {
    return <Switch checked={Boolean(value)} onChange={(checked) => onChange(checked)} />;
  }
  if (type === 'object') {
    return (
      <Input.TextArea
        autoSize={{ minRows: 3, maxRows: 8 }}
        value={JSON.stringify((value as Record<string, unknown>) || {}, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            onChange(parsed);
          } catch {
            onChange({});
          }
        }}
      />
    );
  }
  return (
    <Input.TextArea
      autoSize={{ minRows: 3, maxRows: 8 }}
      value={JSON.stringify((value as unknown[]) || [], null, 2)}
      onChange={(e) => {
        try {
          const parsed = JSON.parse(e.target.value);
          onChange(Array.isArray(parsed) ? parsed : []);
        } catch {
          onChange([]);
        }
      }}
    />
  );
};

export const GlobalVariablesPanel: React.FC<GlobalVariablesPanelProps> = (props) => {
  const { className } = props;
  const { schema, setSchema } = useEditorCore();
  const initial = useInitialGlobals();
  const [form] = Form.useForm<{
    variables: GlobalVariable[];
  }>();

  const onAddVariable = useCallback((): void => {
    const current = (form.getFieldValue('variables') || []) as GlobalVariable[];
    form.setFieldValue('variables', [
      ...current,
      { name: '', description: '', type: 'string', defaultValue: '' },
    ]);
  }, [form]);

  useEffect(() => {
    form.setFieldsValue({
      variables: initial.length
        ? initial
        : [{ name: '', description: '', type: 'string', defaultValue: '' }],
    });
  }, [form, initial]);

  const onSave = useCallback(async (): Promise<void> => {
    try {
      const { variables } = await form.validateFields();
      const nextSchema = SchemaUtils.setGlobalVariables(schema, variables);
      setSchema(nextSchema);
      message.success('全局变量已保存');
    } catch (e) {
      message.error('请检查全局变量配置是否完整');
    }
  }, [schema, setSchema, form]);

  return (
    <div className={cn('h-full', className)}>
      <div className='flex flex-col h-full p-3'>
        <Form form={form} layout='vertical' className='flex-1 overflow-auto'>
          <Form.List name='variables'>
            {(fields, { remove }) => (
              <>
                <div className='grid grid-cols-3 gap-3'>
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className='relative p-3 border border-gray-200 rounded-md bg-white'
                    >
                      <Popconfirm
                        title='确认删除该变量？'
                        okText='删除'
                        cancelText='取消'
                        onConfirm={() => remove(field.name)}
                      >
                        <MinusCircleOutlined className='absolute top-3 right-3 z-10 cursor-pointer' />
                      </Popconfirm>
                      <div className='grid grid-cols-2 gap-3'>
                        <Form.Item
                          label='名称'
                          name={[field.name, 'name']}
                          rules={[{ required: true, message: '请输入变量名称' }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label='描述'
                          rules={[{ required: true, message: '请输入变量描述' }]}
                          name={[field.name, 'description']}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item label='类型' name={[field.name, 'type']}>
                          <Select options={typeOptions} />
                        </Form.Item>
                        <Form.Item noStyle shouldUpdate>
                          {() => {
                            const type = form.getFieldValue([
                              'variables',
                              field.name,
                              'type',
                            ]) as GlobalVariableType;
                            return (
                              <Form.Item
                                label='默认值'
                                name={[field.name, 'defaultValue']}
                                className='col-span-1'
                              >
                                <DefaultValueField
                                  type={type || 'string'}
                                  onChange={(v) =>
                                    form.setFieldValue(['variables', field.name, 'defaultValue'], v)
                                  }
                                  value={form.getFieldValue([
                                    'variables',
                                    field.name,
                                    'defaultValue',
                                  ])}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Form.List>
        </Form>
        <div className='border-t border-gray-200 pt-2 mt-2 bg-gray-50 flex justify-end'>
          <Space>
            <Button onClick={onAddVariable}>新增全局变量</Button>
            <Button type='primary' onClick={onSave}>
              保存全局变量
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};
