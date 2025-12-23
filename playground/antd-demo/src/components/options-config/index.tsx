import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Table, message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { uniqueId } from '@tangramino/base-editor';
import type { TableColumnsType } from 'antd';

export interface OptionItem {
  label: string;
  value: string;
  isDefault?: boolean;
}

interface OptionsConfigProps {
  value?: OptionItem[];
  onChange?: (value: OptionItem[]) => void;
}

interface EditingItem extends OptionItem {
  key: string;
  isEditing?: boolean;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
  'data-is-editing'?: boolean;
}

const Row = (props: RowProps) => {
  const isEditing = props['data-is-editing'];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
    disabled: isEditing,
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isEditing ? 'default' : 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!isEditing ? listeners : {})}
    />
  );
};

export const OptionsConfig: React.FC<OptionsConfigProps> = (props) => {
  const { value, onChange } = props;
  const [dataSource, setDataSource] = useState<EditingItem[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setDataSource(
        (value || []).map((item) => ({
          ...item,
          key: uniqueId(undefined, 6),
        })),
      );
    }
  }, [value]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updateValue = (newItems: EditingItem[]) => {
    setDataSource(newItems);
    onChange?.(
      newItems.filter((item) => !item.isEditing).map(({ label, value }) => ({ label, value })),
    );
  };

  const handleAdd = () => {
    // 检查是否有正在编辑的项
    const hasEditing = dataSource.some((item) => item.isEditing);
    if (hasEditing) {
      message.warning('请先完成当前编辑项');
      return;
    }

    const newItem: EditingItem = {
      label: '',
      value: '',
      key: uniqueId(undefined, 6),
      isEditing: true,
    };
    setDataSource([...dataSource, newItem]);
  };

  const handleEdit = (record: EditingItem) => {
    const newData = dataSource.map((item) =>
      item.key === record.key ? { ...item, isEditing: true } : item,
    );
    setDataSource(newData);
  };

  const handleComplete = (record: EditingItem) => {
    // 验证名称和值是否都已填写
    if (!record.label.trim() || !record.value.trim()) {
      message.error('请填写名称和值');
      return;
    }

    const newData = dataSource.map((item) =>
      item.key === record.key ? { ...item, isEditing: false } : item,
    );
    updateValue(newData);
  };

  const handleCancel = (record: EditingItem) => {
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

  const handleDelete = (record: EditingItem) => {
    const newData = dataSource.filter((item) => item.key !== record.key);
    updateValue(newData);
  };

  const handleChange = (
    record: EditingItem,
    field: 'label' | 'value' | 'defaultValue',
    newValue: string | boolean,
  ) => {
    const newData = dataSource.map((item) =>
      item.key === record.key ? { ...item, [field]: newValue } : item,
    );
    setDataSource(newData);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = dataSource.findIndex((item) => item.key === active.id);
      const newIndex = dataSource.findIndex((item) => item.key === over.id);

      const newData = arrayMove(dataSource, oldIndex, newIndex);
      updateValue(newData);
    }
  };

  const columns: TableColumnsType<EditingItem> = [
    {
      title: '名称',
      dataIndex: 'label',
      key: 'label',
      width: 80,
      ellipsis: true,
      onHeaderCell: () => {
        return {
          style: {
            fontWeight: 'normal',
          },
        };
      },
      onCell: () => {
        return {
          style: {
            padding: 2,
          },
        };
      },
      render: (text, record) =>
        record.isEditing ? (
          <Input
            value={record.label}
            onChange={(e) => handleChange(record, 'label', e.target.value)}
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      ellipsis: true,
      onHeaderCell: () => {
        return {
          style: {
            fontWeight: 'normal',
          },
        };
      },
      onCell: () => {
        return {
          style: {
            padding: 2,
          },
        };
      },
      render: (text, record) =>
        record.isEditing ? (
          <Input onChange={(e) => handleChange(record, 'value', e.target.value)} />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '默认值',
      dataIndex: 'isDefault',
      key: 'isDefault',
      align: 'center',
      width: 60,
      onHeaderCell: () => {
        return {
          style: {
            fontWeight: 'normal',
          },
        };
      },
      onCell: () => {
        return {
          style: {
            padding: 2,
          },
        };
      },
      render: (text, record) => (
        <Checkbox
          checked={text}
          onChange={(e) => handleChange(record, 'defaultValue', e.target.checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 50,
      onHeaderCell: () => {
        return {
          style: {
            fontWeight: 'normal',
          },
        };
      },
      onCell: () => {
        return {
          style: {
            padding: 2,
          },
        };
      },
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
      <div className='text-xs mb-2'>选项配置</div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((item) => item.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            rowKey='key'
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size='small'
            className='mb-1'
            onRow={(record) =>
              ({
                'data-row-key': record.key,
                'data-is-editing': record.isEditing,
              }) as any
            }
          />
        </SortableContext>
      </DndContext>
      <Button type='primary' size='small' block ghost icon={<PlusOutlined />} onClick={handleAdd}>
        添加
      </Button>
    </div>
  );
};
