import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, InputNumber, Select, Table, message, Modal, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { uniqueId } from '@tangramino/base-editor';
import type { TableColumnsType } from 'antd';

export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'email'
  | 'url'
  | 'regexp';

export interface RuleItem {
  required?: boolean;
  type?: RuleType;
  min?: number | null;
  max?: number | null;
  len?: number | null;
  pattern?: string;
  message?: string;
  whitespace?: boolean;
}

interface RuleConfigProps {
  value?: RuleItem[];
  onChange?: (value: RuleItem[]) => void;
}

interface EditingRuleItem extends RuleItem {
  key: string;
  isEditing?: boolean;
}

export const RuleConfig: React.FC<RuleConfigProps> = (props) => {
  const { value, onChange } = props;
  const [dataSource, setDataSource] = useState<EditingRuleItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (Array.isArray(value)) {
      setDataSource(
        (value || []).map((item) => ({
          ...item,
          key: uniqueId(undefined, 6),
          isEditing: false,
        })),
      );
    }
  }, [value]);

  const updateValue = (newItems: EditingRuleItem[]) => {
    setDataSource(newItems);
  };

  const handleOk = () => {
    const final = dataSource
      .filter((item) => !item.isEditing)
      .map(({ required, type, min, max, len, pattern, message, whitespace }) => ({
        required,
        type,
        min: min ?? undefined,
        max: max ?? undefined,
        len: len ?? undefined,
        pattern,
        message,
        whitespace,
      }));
    onChange?.(final);
    setOpen(false);
  };

  const hasEditingItem = (): boolean => dataSource.some((item) => item.isEditing);

  const handleAdd = () => {
    if (hasEditingItem()) {
      message.warning('请先完成当前编辑项');
      return;
    }
    const newItem: EditingRuleItem = {
      key: uniqueId(undefined, 6),
      isEditing: true,
      required: false,
      whitespace: false,
      type: undefined,
      min: null,
      max: null,
      len: null,
      pattern: '',
      message: '',
    };
    setDataSource([...dataSource, newItem]);
  };

  const handleEdit = (record: EditingRuleItem) => {
    const newData = dataSource.map((item) =>
      item.key === record.key ? { ...item, isEditing: true } : item,
    );
    setDataSource(newData);
  };

  const handleComplete = (record: EditingRuleItem) => {
    const newData = dataSource.map((item) =>
      item.key === record.key ? { ...item, isEditing: false } : item,
    );
    updateValue(newData);
  };

  const handleCancel = (record: EditingRuleItem) => {
    const originalIndex = dataSource.findIndex((item) => item.key === record.key);
    if (!value?.[originalIndex] || record.isEditing) {
      const newData = dataSource.filter((item) => item.key !== record.key);
      setDataSource(newData);
    } else {
      const newData = dataSource.map((item) =>
        item.key === record.key
          ? { ...value[originalIndex], key: item.key, isEditing: false }
          : item,
      );
      setDataSource(newData);
    }
  };

  const handleDelete = (record: EditingRuleItem) => {
    const newData = dataSource.filter((item) => item.key !== record.key);
    updateValue(newData);
  };

  const handleChange = (
    record: EditingRuleItem,
    field: keyof RuleItem,
    newValue: string | number | null | boolean | RuleType | undefined,
  ) => {
    const newData = dataSource.map((item) =>
      item.key === record.key ? { ...item, [field]: newValue } : item,
    );
    setDataSource(newData);
  };

  const ruleTypeOptions: { label: string; value: RuleType }[] = [
    { label: 'string', value: 'string' },
    { label: 'number', value: 'number' },
    { label: 'boolean', value: 'boolean' },
    { label: 'array', value: 'array' },
    { label: 'object', value: 'object' },
  ];

  const columns: TableColumnsType<EditingRuleItem> = [
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      align: 'center',
      width: 60,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (val, record) => (
        <Checkbox
          checked={Boolean(val)}
          onChange={(e) => handleChange(record, 'required', e.target.checked)}
          disabled={!record.isEditing}
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      ellipsis: true,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (text, record) =>
        record.isEditing ? (
          <Select
            value={text as RuleType | undefined}
            style={{ width: '100%' }}
            onChange={(v) => handleChange(record, 'type', v)}
            allowClear
            options={ruleTypeOptions}
          />
        ) : (
          <span>{text || '-'}</span>
        ),
    },
    {
      title: '最小值',
      dataIndex: 'min',
      key: 'min',
      width: 80,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (text, record) =>
        record.isEditing ? (
          <InputNumber
            value={record.min ?? undefined}
            onChange={(v) => handleChange(record, 'min', v ?? null)}
            style={{ width: '100%' }}
            disabled={record.type !== 'number' && record.type !== 'string'}
          />
        ) : (
          <span>{text ?? '-'}</span>
        ),
    },
    {
      title: '最大值',
      dataIndex: 'max',
      key: 'max',
      width: 80,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (text, record) =>
        record.isEditing ? (
          <InputNumber
            value={record.max ?? undefined}
            onChange={(v) => handleChange(record, 'max', v ?? null)}
            style={{ width: '100%' }}
            disabled={record.type !== 'number' && record.type !== 'string'}
          />
        ) : (
          <span>{text ?? '-'}</span>
        ),
    },
    {
      title: '长度',
      dataIndex: 'len',
      key: 'len',
      width: 80,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (text, record) =>
        record.isEditing ? (
          <InputNumber
            value={record.len ?? undefined}
            onChange={(v) => handleChange(record, 'len', v ?? null)}
            style={{ width: '100%' }}
            disabled={record.type !== 'number' && record.type !== 'string'}
          />
        ) : (
          <span>{text ?? '-'}</span>
        ),
    },
    {
      title: '正则',
      dataIndex: 'pattern',
      key: 'pattern',
      ellipsis: true,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (text, record) =>
        record.isEditing ? (
          <Input
            value={record.pattern}
            onChange={(e) => handleChange(record, 'pattern', e.target.value)}
          />
        ) : (
          <span>{text || '-'}</span>
        ),
    },
    {
      title: '错误提示',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (text, record) =>
        record.isEditing ? (
          <Input
            value={record.message}
            onChange={(e) => handleChange(record, 'message', e.target.value)}
          />
        ) : (
          <span>{text || '-'}</span>
        ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      onHeaderCell: () => ({
        style: { fontWeight: 'normal' },
      }),
      onCell: () => ({
        style: { padding: 2 },
      }),
      render: (_, record) =>
        record.isEditing ? (
          <div className='flex gap-2'>
            <CheckOutlined onClick={() => handleComplete(record)} />
            <CloseOutlined onClick={() => handleCancel(record)} />
          </div>
        ) : (
          <div className='flex gap-2'>
            <EditOutlined onClick={() => handleEdit(record)} />
            <DeleteOutlined onClick={() => handleDelete(record)} />
          </div>
        ),
    },
  ];

  return (
    <div className='w-full'>
      <Button type='primary' ghost onClick={() => setOpen(true)}>
        配置校验规则
      </Button>
      <Modal
        open={open}
        title='检验规则配置'
        width={720}
        onCancel={() => {
          setOpen(false);
          setDataSource(
            (value || []).map((item) => ({
              ...item,
              key: uniqueId(undefined, 6),
              isEditing: false,
            })),
          );
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                setOpen(false);
                setDataSource(
                  (value || []).map((item) => ({
                    ...item,
                    key: uniqueId(undefined, 6),
                    isEditing: false,
                  })),
                );
              }}
            >
              取消
            </Button>
            <Button type='primary' onClick={handleOk}>
              确定
            </Button>
          </Space>
        }
      >
        <div className='w-full'>
          <Table
            rowKey='key'
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size='small'
            className='mb-1'
          />
          <Button type='primary' block ghost icon={<PlusOutlined />} onClick={handleAdd}>
            添加
          </Button>
        </div>
      </Modal>
    </div>
  );
};
