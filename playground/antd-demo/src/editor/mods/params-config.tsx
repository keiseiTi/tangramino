import React, { useCallback } from 'react';
import { Button, Input, Select, Table, Popconfirm, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { uniqueId } from '@tangramino/base-editor';
import type { FieldConfig, FieldType } from '@/hooks/use-data-sources';

interface ParamsConfigProps {
  params: FieldConfig[];
  type: 'request' | 'response';
  onAdd: () => void;
  onSave: () => void;
  onChange: (params: FieldConfig[]) => void;
}

// 独立的参数表格组件，用于递归渲染
interface ParamsTableProps {
  params: FieldConfig[];
  type: 'request' | 'response';
  onChange: (params: FieldConfig[]) => void;
  level?: number;
}

const fieldTypeOptions: { label: string; value: FieldType }[] = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Array', value: 'array' },
  { label: 'Object', value: 'object' },
];

const ParamsTable: React.FC<ParamsTableProps> = ({ params, type, onChange, level = 0 }) => {
  // 添加子字段到指定的父字段（只在当前层级查找）
  const handleAddField = useCallback(
    (parentId: string) => {
      const newField: FieldConfig = {
        // 子字段 id 加上父级命名空间，避免任何跨层级 key 冲突
        id: `${parentId}__${uniqueId(undefined, 8)}`,
        name: '',
        type: 'string',
        description: '',
        required: type === 'request' ? false : undefined,
      };

      // 只在当前层级查找，不递归
      const newParams = params.map((field) => {
        if (field.id === parentId) {
          return {
            ...field,
            children: [...(field.children || []), newField],
          };
        }
        return field;
      });
      onChange(newParams);
    },
    [params, type, onChange],
  );

  // 删除字段（只在当前层级操作）
  const handleDeleteField = useCallback(
    (id: string) => {
      const newParams = params.filter((field) => field.id !== id);
      onChange(newParams);
    },
    [params, onChange],
  );

  // 更新字段（只在当前层级操作）
  const handleUpdateField = useCallback(
    (id: string, key: keyof FieldConfig, value: any) => {
      const newParams = params.map((field) => {
        if (field.id === id) {
          const updated = { ...field, [key]: value };
          // 如果改变类型为非object/array，清除children
          if (key === 'type' && value !== 'object' && value !== 'array') {
            updated.children = undefined;
          }
          return updated;
        }
        return field;
      });
      onChange(newParams);
    },
    [params, onChange],
  );

  // 更新子字段的处理函数（只在当前层级查找）
  const handleChildrenChange = useCallback(
    (parentId: string, newChildren: FieldConfig[]) => {
      const newParams = params.map((field) => {
        if (field.id === parentId) {
          return { ...field, children: newChildren };
        }
        return field;
      });
      onChange(newParams);
    },
    [params, onChange],
  );

  const columns: ColumnsType<FieldConfig> = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateField(record.id, 'name', e.target.value)}
          placeholder='请输入字段名'
          size='small'
        />
      ),
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleUpdateField(record.id, 'type', value)}
          options={fieldTypeOptions}
          size='small'
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '字段说明',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateField(record.id, 'description', e.target.value)}
          placeholder='请输入说明'
          size='small'
        />
      ),
    },
  ];

  // 仅在请求参数时显示"是否必须"列
  if (type === 'request') {
    columns.push({
      title: '是否必须',
      dataIndex: 'required',
      key: 'required',
      width: 80,
      align: 'center',
      render: (text, record) => (
        <Checkbox
          checked={text}
          onChange={(e) => handleUpdateField(record.id, 'required', e.target.checked)}
        />
      ),
    });
  }

  columns.push({
    title: '操作',
    key: 'action',
    width: 60,
    align: 'center',
    render: (_, record) => (
      <Popconfirm title='确认删除？' onConfirm={() => handleDeleteField(record.id)}>
        <DeleteOutlined />
      </Popconfirm>
    ),
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={params}
        rowKey='id'
        pagination={false}
        size='small'
        bordered
        expandable={{
          childrenColumnName: '__tg_children',
          expandedRowRender: (record) => {
            if (record.type === 'object' || record.type === 'array') {
              const parentId = record.id;
              return (
                <div key={`${level}-${record.id}`}>
                  {record.children && record.children.length > 0 && (
                    <ParamsTable
                      key={`${level + 1}-${record.id}`}
                      params={record.children}
                      type={type}
                      onChange={(newChildren) => handleChildrenChange(parentId, newChildren)}
                      level={level + 1}
                    />
                  )}
                  <div className='overflow-hidden mt-4 flex justify-end'>
                    <Button
                      type='dashed'
                      icon={<PlusOutlined />}
                      size='small'
                      onClick={() => handleAddField(parentId)}
                      className='w-[calc(100%-40px)]'
                    >
                      添加子字段
                    </Button>
                  </div>
                </div>
              );
            }
            return null;
          },
          rowExpandable: (record) => record.type === 'object' || record.type === 'array',
        }}
      />
    </div>
  );
};

export const ParamsConfig: React.FC<ParamsConfigProps> = (props) => {
  const { params, type, onChange } = props;

  return (
    <div>
      {params.length > 0 ? (
        <ParamsTable params={params} type={type} onChange={onChange} />
      ) : (
        <div className='text-center text-gray-400 py-8'>暂无参数配置，点击"添加字段"开始配置</div>
      )}
    </div>
  );
};
