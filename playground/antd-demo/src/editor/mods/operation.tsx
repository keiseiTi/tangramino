import React from 'react';
import { useEditorCore, usePluginContext } from '@tangramino/base-editor';
import { Button, message, Radio, InputNumber, type RadioChangeEvent, Space } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { cn } from '@/utils';
import { useEditorContext } from '@/hooks/use-editor-context';
import { SchemaUtils } from '@tangramino/engine';
interface OperationProps {
  className?: string;
}
export const Operation = (props: OperationProps) => {
  const { className } = props;
  const { schema, setSchema } = useEditorCore();
  const {
    mode,
    setMode,
    setLeftPanel,
    viewportDevice,
    setViewportDevice,
    viewportWidth,
    setViewportWidth,
  } = useEditorContext();
  const history = usePluginContext<any>('history');

  const onSave = () => {
    sessionStorage.setItem('tg_schema', JSON.stringify(SchemaUtils.normalizeSchema(schema)));
    message.success('保存成功');
  };

  const onPreview = () => {
    window.open('/preview', '_blank');
  };

  const onModeChange = (e: RadioChangeEvent) => {
    const nextMode = e.target.value as 'view' | 'logic';
    setMode(nextMode);
    setLeftPanel(nextMode);
  };

  const onDeviceChange = (e: RadioChangeEvent) => {
    const nextDevice = e.target.value as 'PC' | 'PAD' | 'MOBILE';
    setViewportDevice(nextDevice);
  };

  const onWidthChange = (value: number | null) => {
    setViewportWidth(Number(value || 0));
  };

  const onUndo = () => {
    if (history?.canUndo?.()) {
      const next = history.undo(schema);
      setSchema(next);
    }
  };

  const onRedo = () => {
    if (history?.canRedo?.()) {
      const next = history.redo(schema);
      setSchema(next);
    }
  };

  return (
    <div className={cn('h-12 flex items-center px-3 justify-between bg-white', className)}>
      <span className='text-base font-semibold'>Tangramino 低代码编辑器</span>
      <div className='flex items-center gap-3 w-<0.8>'>
        <Radio.Group
          optionType='button'
          buttonStyle='solid'
          value={viewportDevice}
          onChange={onDeviceChange}
        >
          <Radio value={'PC'}>PC</Radio>
          <Radio value={'MOBILE'}>MOBILE</Radio>
        </Radio.Group>
        <div className='flex items-center gap-1'>
          <span className='text-xs text-gray-600'>画布宽度</span>
          <InputNumber
            min={240}
            value={viewportWidth}
            onChange={onWidthChange}
            size='small'
            className='w-24'
          />
          <span className='text-xs text-gray-500'>px</span>
        </div>
        <Radio.Group optionType='button' buttonStyle='solid' value={mode} onChange={onModeChange}>
          <Radio value={'view'}>视图</Radio>
          <Radio value={'logic'}>逻辑</Radio>
        </Radio.Group>
        <Space.Compact>
          <Button
            icon={<UndoOutlined />}
            disabled={!history?.canUndo?.()}
            onClick={onUndo}
          ></Button>
          <Button
            icon={<RedoOutlined />}
            disabled={!history?.canRedo?.()}
            onClick={onRedo}
          ></Button>
        </Space.Compact>
      </div>
      <div className='flex items-center'>
        <Button type='primary' ghost onClick={onPreview} className='mr-2'>
          预览
        </Button>
        <Button type='primary' onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  );
};
