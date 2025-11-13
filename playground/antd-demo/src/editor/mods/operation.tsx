import React, { useState } from 'react';
import { useEditorCore } from '@tangramino/core';
import { Button, message, Radio, type RadioChangeEvent } from 'antd';
import { cn } from '@/utils';
import { useEditorContext } from '@/hooks/use-editor-context';
import { SchemaUtils } from '@tangramino/engine';
import type { FlowGraphData } from '@tangramino/flow-editor';
interface OperationProps {
  className?: string;
}
export const Operation = (props: OperationProps) => {
  const { className } = props;
  const { schema, materials } = useEditorCore();
  const { mode, setMode, activeElementEvent, setActiveElementEvent, setFlowGraphData } =
    useEditorContext();

  const onSave = () => {
    sessionStorage.setItem('schema', JSON.stringify(SchemaUtils.normalizeSchema(schema)));
    message.success('保存成功');
  };

  const onPreview = () => {
    window.open('/preview', '_blank');
  };

  const onModeChange = (e: RadioChangeEvent) => {
    if (!activeElementEvent) {
      const basicPage = SchemaUtils.getElementsByType(schema, 'basicPage')[0];
      if (basicPage) {
        const basicPageMaterial = materials.find((material) => material.type === basicPage.type);
        const method = basicPageMaterial?.contextConfig?.methods?.[0]!;
        setActiveElementEvent({
          elementId: basicPage.id,
          material: basicPageMaterial!,
          method,
        });
        const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
          schema!,
          `${basicPage.id}::${method.name}`,
        );
        setFlowGraphData(flowGraphData);
      }
    }
    setMode(e.target.value);
  };

  return (
    <div
      className={cn('h-12 flex items-center px-3 justify-between bg-white', className)}
    >
      <span className='text-base font-semibold'>Tangramino 低代码编辑器</span>
      <div className='flex items-center gap-3'>
        <Radio.Group optionType='button' buttonStyle='solid' value={mode} onChange={onModeChange}>
          <Radio value={'view'}>视图</Radio>
          <Radio value={'logic'}>逻辑</Radio>
        </Radio.Group>
      </div>
      <div className='flex items-center'>
        <Button size='small' type='primary' onClick={onPreview} className='mr-2'>
          预览
        </Button>
        <Button size='small' type='primary' ghost onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  );
};
