import React, { useMemo, useState, useCallback } from 'react';
import { Button, Form, Input, Modal, Select, Space, message, Popconfirm } from 'antd';
import { useDataSources, type DataSourceItem, type HttpMethod } from '@/hooks/use-data-sources';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { cn } from '@/utils';

interface DataSourcePanelProps {
  className?: string;
}

const methodOptions: { label: string; value: HttpMethod }[] = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
];

export const DataSourcePanel: React.FC<DataSourcePanelProps> = (props) => {
  const { className } = props;
  const { sources, addSource, updateSource, deleteSource } = useDataSources();
  const [searchText, setSearchText] = useState<string>('');
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<DataSourceItem | null>(null);
  const [addForm] = Form.useForm<{ name: string; url: string; method: HttpMethod }>();
  const [editForm] = Form.useForm<{ url: string; method: HttpMethod }>();

  const filtered = useMemo<DataSourceItem[]>(() => {
    const q = searchText.trim();
    if (!q) return sources;
    return sources.filter((s) => s.name.includes(q) || s.url.includes(q));
  }, [sources, searchText]);

  const onOpenAdd = useCallback((): void => {
    setAddOpen(true);
    addForm.setFieldsValue({ name: '', url: '', method: 'GET' });
  }, [addForm]);

  const onConfirmAdd = useCallback(async (): Promise<void> => {
    try {
      const { name, url, method } = await addForm.validateFields();
      const ret = addSource({ name, url, method });
      if (!ret.success) {
        message.error(ret.error || '新增失败');
        return;
      }
      setAddOpen(false);
      message.success('新增数据源成功');
    } catch {
      message.error('请完善数据源信息');
    }
  }, [addForm, addSource]);

  const onOpenEdit = useCallback(
    (item: DataSourceItem): void => {
      setEditing(item);
      setEditOpen(true);
      editForm.setFieldsValue({ url: item.url, method: item.method });
    },
    [editForm],
  );

  const onConfirmEdit = useCallback(async (): Promise<void> => {
    try {
      if (!editing) return;
      const { url, method } = await editForm.validateFields();
      const ret = updateSource(editing.id, { url, method });
      if (!ret.success) {
        message.error(ret.error || '编辑失败');
        return;
      }
      setEditOpen(false);
      setEditing(null);
      message.success('编辑数据源成功');
    } catch {
      message.error('请完善数据源信息');
    }
  }, [editForm, updateSource, editing]);

  const onDelete = useCallback(
    (id: string): void => {
      const ret = deleteSource(id);
      if (ret.success) {
        message.success('删除成功');
      }
    },
    [deleteSource],
  );

  return (
    <div className={cn('h-full', className)}>
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between p-2 border-b border-gray-200'>
          <Input
            placeholder='搜索接口名或地址'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='max-w-[340px]'
          />
          <Button type='primary' onClick={onOpenAdd}>
            新增数据源
          </Button>
        </div>
        <div className='flex-1 overflow-auto p-3'>
          <div className='grid grid-cols-4 gap-3'>
            {filtered.map((item) => (
              <div
                key={item.id}
                className='border border-gray-200 rounded-md bg-white p-3 shadow-sm'
              >
                <div className='font-medium text-gray-900'>{item.name}</div>
                <div className='text-xs text-gray-500 break-all mt-1'>{item.url}</div>
                <div className='text-xs text-gray-700 mt-1'>方法：{item.method}</div>
                <div className='flex justify-end mt-3'>
                  <Space size={8}>
                    <EditOutlined onClick={() => onOpenEdit(item)} />
                    <Popconfirm title='确认删除该数据源？' onConfirm={() => onDelete(item.id)}>
                      <DeleteOutlined />
                    </Popconfirm>
                  </Space>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal
          title='新增数据源'
          open={addOpen}
          onOk={onConfirmAdd}
          onCancel={() => setAddOpen(false)}
          okText='确定'
          cancelText='取消'
          destroyOnHidden
        >
          <Form form={addForm} layout='vertical'>
            <Form.Item
              label='接口名'
              name='name'
              rules={[{ required: true, message: '请输入接口名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='接口地址'
              name='url'
              rules={[{ required: true, message: '请输入接口地址' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label='请求方法' name='method' initialValue={'GET'}>
              <Select options={methodOptions} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title='编辑数据源'
          open={editOpen}
          onOk={onConfirmEdit}
          onCancel={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          okText='确定'
          cancelText='取消'
          destroyOnHidden
        >
          <Form form={editForm} layout='vertical'>
            <Form.Item label='接口名'>
              <Input value={editing?.name || ''} disabled />
            </Form.Item>
            <Form.Item
              label='接口地址'
              name='url'
              rules={[{ required: true, message: '请输入接口地址' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label='请求方法' name='method'>
              <Select options={methodOptions} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
