import React, { useState } from 'react';
import { Button, Input, Table } from 'antd';
import type { TableColumnsType } from 'antd';
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

export interface OptionItem {
  label: string;
  value: string;
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

export const OptionsConfig: React.FC<OptionsConfigProps> = ({ value = [], onChange }) => {
  const [dataSource, setDataSource] = useState<EditingItem[]>(() =>
    value.map((item, index) => ({
      ...item,
      key: `${Date.now()}-${index}`,
    })),
  );

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
    const newItem: EditingItem = {
      label: '',
      value: '',
      key: `${Date.now()}`,
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
    // Validate that both label and value are filled
    if (!record.label.trim() || !record.value.trim()) {
      // Remove the item if incomplete
      const newData = dataSource.filter((item) => item.key !== record.key);
      updateValue(newData);
    } else {
      const newData = dataSource.map((item) =>
        item.key === record.key ? { ...item, isEditing: false } : item,
      );
      updateValue(newData);
    }
  };

  const handleCancel = (record: EditingItem) => {
    const originalIndex = dataSource.findIndex((item) => item.key === record.key);

    // If it's a new item (was in editing mode from start), remove it
    if (!value?.[originalIndex] || record.isEditing) {
      const newData = dataSource.filter((item) => item.key !== record.key);
      setDataSource(newData);
    } else {
      // Restore original values
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

  const handleChange = (record: EditingItem, field: 'label' | 'value', newValue: string) => {
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
      render: (text, record) =>
        record.isEditing ? (
          <Input
            placeholder='名称'
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
      render: (text, record) =>
        record.isEditing ? (
          <Input
            placeholder='值'
            value={record.value}
            onChange={(e) => handleChange(record, 'value', e.target.value)}
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 50,
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={dataSource.map((item) => item.key)} strategy={verticalListSortingStrategy}>
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
            onRow={(record) => ({
              'data-row-key': record.key,
              'data-is-editing': record.isEditing,
            } as any)}
          />
        </SortableContext>
      </DndContext>
      <Button type='primary' size='small' block ghost icon={<PlusOutlined />} onClick={handleAdd}>
        添加
      </Button>
    </div>
  );
};

