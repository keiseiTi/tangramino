import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  message,
  Modal,
  Space,
  Popconfirm,
  Checkbox,
  type TableColumnsType,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { uniqueId } from '@tangramino/base-editor';
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

export type AlignType = 'left' | 'center' | 'right';
export type FixedType = 'left' | 'right' | false;

export interface ColumnItem {
  title?: string;
  dataIndex?: string;
  width?: number | null;
  align?: AlignType;
  fixed?: FixedType;
  ellipsis?: boolean;
}

interface ColumnConfigProps {
  value?: ColumnItem[];
  onChange?: (value: ColumnItem[]) => void;
}

interface EditingColumnItem extends ColumnItem {
  key: string;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

export const ColumnConfig: React.FC<ColumnConfigProps> = (props) => {
  const { value, onChange } = props;
  const [dataSource, setDataSource] = useState<EditingColumnItem[]>([]);
  const [editingDataSource, setEditingDataSource] = useState<EditingColumnItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);

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

  const handleOpenModal = () => {
    setEditingDataSource([...dataSource]);
    setOpen(true);
  };

  const handleOk = () => {
    // 验证所有列都有标题和字段
    const hasInvalid = editingDataSource.some((item) => !item.title || !item.dataIndex);
    if (hasInvalid) {
      message.warning('所有列都必须有列名和字段');
      return;
    }

    const final = editingDataSource.map(({ title, dataIndex, width, align, fixed, ellipsis }) => ({
      title,
      dataIndex,
      width: width ?? undefined,
      align,
      fixed: fixed || undefined,
      ellipsis,
    }));
    onChange?.(final);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    const newItem: EditingColumnItem = {
      key: uniqueId(undefined, 6),
      title: '',
      dataIndex: '',
      width: null,
      align: 'left',
      fixed: false,
      ellipsis: false,
    };
    setEditingDataSource([...editingDataSource, newItem]);
  };

  const handleDelete = (record: EditingColumnItem) => {
    const newData = editingDataSource.filter((item) => item.key !== record.key);
    setEditingDataSource(newData);
  };

  const handleDeleteSaved = (record: EditingColumnItem) => {
    const newData = dataSource.filter((item) => item.key !== record.key);
    const final = newData.map(({ title, dataIndex, width, align, fixed, ellipsis }) => ({
      title,
      dataIndex,
      width: width ?? undefined,
      align,
      fixed: fixed || undefined,
      ellipsis,
    }));
    onChange?.(final);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newData = [...editingDataSource];
    [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
    setEditingDataSource(newData);
  };

  const handleMoveDown = (index: number) => {
    if (index === editingDataSource.length - 1) return;
    const newData = [...editingDataSource];
    [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
    setEditingDataSource(newData);
  };

  const handleChange = (
    record: EditingColumnItem,
    field: keyof ColumnItem,
    newValue: string | number | null | boolean | AlignType | FixedType,
  ) => {
    const newData = editingDataSource.map((item) =>
      item.key === record.key ? { ...item, [field]: newValue } : item,
    );
    setEditingDataSource(newData);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = dataSource.findIndex((item) => item.key === active.id);
      const newIndex = dataSource.findIndex((item) => item.key === over.id);

      const newData = arrayMove(dataSource, oldIndex, newIndex);
      const final = newData.map(({ title, dataIndex, width, align, fixed, ellipsis }) => ({
        title,
        dataIndex,
        width: width ?? undefined,
        align,
        fixed: fixed || undefined,
        ellipsis,
      }));
      onChange?.(final);
    }
  };

  const alignOptions = [
    { label: '左对齐', value: 'left' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'right' },
  ];

  const fixedOptions = [
    { label: '不固定', value: false },
    { label: '固定左侧', value: 'left' },
    { label: '固定右侧', value: 'right' },
  ];

  // 弹窗内编辑表格的列配置
  const editingColumns: TableColumnsType<EditingColumnItem> = [
    {
      title: '列名',
      dataIndex: 'title',
      key: 'title',
      width: 120,
      ellipsis: true,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleChange(record, 'title', e.target.value)}
          placeholder='请输入列名'
        />
      ),
    },
    {
      title: '字段',
      dataIndex: 'dataIndex',
      key: 'dataIndex',
      width: 120,
      ellipsis: true,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleChange(record, 'dataIndex', e.target.value)}
          placeholder='请输入字段名'
        />
      ),
    },
    {
      title: '宽度',
      dataIndex: 'width',
      key: 'width',
      width: 80,
      render: (_, record) => (
        <InputNumber
          value={record.width ?? undefined}
          onChange={(v) => handleChange(record, 'width', v ?? null)}
          style={{ width: '100%' }}
          placeholder='宽度'
          min={1}
        />
      ),
    },
    {
      title: '对齐',
      dataIndex: 'align',
      key: 'align',
      width: 100,
      render: (text, record) => (
        <Select
          value={text}
          style={{ width: '100%' }}
          onChange={(v) => handleChange(record, 'align', v)}
          options={alignOptions}
        />
      ),
    },
    {
      title: '固定',
      dataIndex: 'fixed',
      key: 'fixed',
      width: 100,
      render: (text, record) => (
        <Select
          value={text}
          style={{ width: '100%' }}
          onChange={(v) => handleChange(record, 'fixed', v)}
          options={fixedOptions}
        />
      ),
    },
    {
      title: '超出省略',
      dataIndex: 'ellipsis',
      key: 'ellipsis',
      align: 'center',
      width: 80,
      render: (val, record) => (
        <Checkbox
          checked={Boolean(val)}
          onChange={(e) => handleChange(record, 'ellipsis', e.target.checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record, index) => (
        <div className='flex gap-2'>
          <ArrowUpOutlined
            onClick={() => handleMoveUp(index)}
            style={{
              opacity: index === 0 ? 0.3 : 1,
              cursor: index === 0 ? 'not-allowed' : 'pointer',
            }}
          />
          <ArrowDownOutlined
            onClick={() => handleMoveDown(index)}
            style={{
              opacity: index === editingDataSource.length - 1 ? 0.3 : 1,
              cursor: index === editingDataSource.length - 1 ? 'not-allowed' : 'pointer',
            }}
          />
          <DeleteOutlined onClick={() => handleDelete(record)} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  return (
    <div className='w-full'>
      {dataSource?.length ? (
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
              columns={[
                {
                  title: '列名',
                  dataIndex: 'title',
                },
                {
                  title: '字段',
                  dataIndex: 'dataIndex',
                },
                {
                  title: '操作',
                  width: 50,
                  render: (_, record) => (
                    <Popconfirm title='确定删除该列吗？' onConfirm={() => handleDeleteSaved(record)}>
                      <DeleteOutlined />
                    </Popconfirm>
                  ),
                },
              ]}
              dataSource={dataSource}
              pagination={false}
              size='small'
              className='mb-1'
              scroll={{ x: 'max-content' }}
              onRow={(record) =>
                ({
                  'data-row-key': record.key,
                }) as any
              }
            />
          </SortableContext>
        </DndContext>
      ) : null}
      <Button type='primary' ghost onClick={handleOpenModal}>
        配置列
      </Button>
      <Modal
        open={open}
        title='列配置'
        width={800}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type='primary' onClick={handleOk}>
              确定
            </Button>
          </Space>
        }
      >
        <div className='w-full'>
          <Table
            rowKey='key'
            columns={editingColumns}
            dataSource={editingDataSource}
            pagination={false}
            size='small'
            className='mb-1'
            scroll={{ x: 'max-content' }}
          />
          <Button type='primary' block ghost icon={<PlusOutlined />} onClick={handleAdd}>
            添加列
          </Button>
        </div>
      </Modal>
    </div>
  );
};
