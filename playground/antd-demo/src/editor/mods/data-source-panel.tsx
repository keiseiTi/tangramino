import React, { useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  message,
  Popconfirm,
  Table,
  Tabs,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  useDataSources,
  type DataSourceItem,
  type HttpMethod,
  type FieldConfig,
} from '@/hooks/use-data-sources';
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { cn } from '@/utils';
import { uniqueId } from '@tangramino/base-editor';
import { ParamsConfig } from './params-config';

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editing, setEditing] = useState<DataSourceItem | null>(null);
  const [selectedSource, setSelectedSource] = useState<DataSourceItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('request');
  const [requestParams, setRequestParams] = useState<FieldConfig[]>([]);
  const [responseParams, setResponseParams] = useState<FieldConfig[]>([]);
  const [form] = Form.useForm<{ name: string; url: string; method: HttpMethod }>();

  const onOpenAdd = useCallback((): void => {
    setModalType('add');
    setEditing(null);
    form.setFieldsValue({ name: '', url: '', method: 'GET' });
    setModalOpen(true);
  }, [form]);

  const onOpenEdit = useCallback(
    (item: DataSourceItem): void => {
      setModalType('edit');
      setEditing(item);
      form.setFieldsValue({ name: item.name, url: item.url, method: item.method });
      setModalOpen(true);
    },
    [form],
  );

  const onConfirmModal = useCallback(async (): Promise<void> => {
    try {
      const values = await form.validateFields();

      if (modalType === 'add') {
        const ret = addSource(values);
        if (!ret.success) {
          message.error(ret.error || '新增失败');
          return;
        }
        message.success('新增数据源成功');
      } else {
        if (!editing) return;
        const ret = updateSource(editing.id, { url: values.url, method: values.method });
        if (!ret.success) {
          message.error(ret.error || '编辑失败');
          return;
        }
        message.success('编辑数据源成功');
      }

      setModalOpen(false);
      setEditing(null);
    } catch {
      message.error('请完善数据源信息');
    }
  }, [form, modalType, addSource, updateSource, editing]);

  const onDelete = useCallback(
    (id: string): void => {
      const ret = deleteSource(id);
      if (ret.success) {
        message.success('删除成功');
        if (selectedSource?.id === id) {
          setSelectedSource(null);
        }
      }
    },
    [deleteSource, selectedSource],
  );

  const onConfigure = useCallback((item: DataSourceItem): void => {
    setSelectedSource(item);
    setRequestParams(item.requestParams || []);
    setResponseParams(item.responseParams || []);
    setActiveTab('request');
  }, []);

  const onSaveAllParams = useCallback((): void => {
    if (!selectedSource) return;
    const ret = updateSource(selectedSource.id, {
      requestParams,
      responseParams,
    });
    if (ret.success) {
      message.success('保存成功');
      // 更新选中的数据源
      const updated = sources.find((s) => s.id === selectedSource.id);
      if (updated) {
        setSelectedSource(updated);
      }
    } else {
      message.error('保存失败');
    }
  }, [selectedSource, updateSource, sources, requestParams, responseParams]);

  const onAddField = useCallback((): void => {
    if (activeTab === 'request') {
      const newField: FieldConfig = {
        id: 'field_' + uniqueId(undefined, 8),
        name: '',
        type: 'string',
        description: '',
        required: false,
      };
      setRequestParams([...requestParams, newField]);
    } else {
      const newField: FieldConfig = {
        id: 'field_' + uniqueId(undefined, 8),
        name: '',
        type: 'string',
        description: '',
      };
      setResponseParams([...responseParams, newField]);
    }
  }, [activeTab, requestParams, responseParams]);

  const columns: ColumnsType<DataSourceItem> = [
    {
      title: '接口名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '接口地址',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space size='small'>
          <Tooltip title='编辑'>
            <EditOutlined onClick={() => onOpenEdit(record)} />
          </Tooltip>
          <Tooltip title='配置'>
            <SettingOutlined onClick={() => onConfigure(record)} />
          </Tooltip>
          <Popconfirm title='确认删除该数据源？' onConfirm={() => onDelete(record.id)}>
            <Tooltip title='删除'>
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={cn('h-full flex', className)}>
      {/* 左侧：数据源列表 */}
      <div className='flex flex-col border-r border-gray-200 w-100'>
        <div className='flex items-center justify-between p-2 border-b border-gray-200 h-12'>
          <h3 className='text-base font-semibold m-0'>数据源列表</h3>
          <Button type='primary' onClick={onOpenAdd}>
            新建
          </Button>
        </div>
        <div className='flex-1 overflow-auto p-2'>
          <Table
            columns={columns}
            dataSource={sources}
            rowKey='id'
            pagination={false}
            size='small'
          />
        </div>
      </div>

      {/* 右侧：参数配置 */}
      <div className='flex flex-col flex-1'>
        <div className='flex items-center justify-between p-2 border-b border-gray-200 h-12'>
          <h3 className='text-base font-semibold m-0'>参数配置</h3>
          {selectedSource && (
            <Button type='primary' onClick={onSaveAllParams}>
              保存
            </Button>
          )}
        </div>
        <div className='flex-1 overflow-auto p-2'>
          {selectedSource ? (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarExtraContent={
                <Button type='primary' ghost icon={<PlusOutlined />} onClick={onAddField}>
                  添加字段
                </Button>
              }
              items={[
                {
                  key: 'request',
                  label: '请求参数',
                  children: (
                    <ParamsConfig
                      params={requestParams}
                      type='request'
                      onAdd={onAddField}
                      onSave={onSaveAllParams}
                      onChange={setRequestParams}
                    />
                  ),
                },
                {
                  key: 'response',
                  label: '返回参数',
                  children: (
                    <ParamsConfig
                      params={responseParams}
                      type='response'
                      onAdd={onAddField}
                      onSave={onSaveAllParams}
                      onChange={setResponseParams}
                    />
                  ),
                },
              ]}
            />
          ) : (
            <div className='flex items-center justify-center h-full text-gray-400'>
              请选择数据源并点击"配置"按钮
            </div>
          )}
        </div>
      </div>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增数据源' : '编辑数据源'}
        open={modalOpen}
        onOk={onConfirmModal}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        okText='确定'
        cancelText='取消'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='接口名'
            name='name'
            rules={[{ required: true, message: '请输入接口名' }]}
          >
            <Input disabled={modalType === 'edit'} />
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
    </div>
  );
};
