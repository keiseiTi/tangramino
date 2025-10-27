import React, { useEffect, useState } from 'react';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn } from '@/utils';
import { Select } from 'antd';
import { SchemaUtils } from '@tangramino/engine';
import { uniqueId, useEditorCore } from '@tangramino/core';
import { useClientContext, type FlowGraphData } from '@tangramino/flow-editor';

export const Operation = () => {
  const { activeElementEvent, setFlowGraphData, setActiveElementEvent } = useEditorContext();
  const { schema } = useEditorCore();
  const { elementId, material, method } = activeElementEvent || {};
  const [selectedMethod, setSelectedMethod] = useState<string>();
  const clientContext = useClientContext();

  useEffect(() => {
    setSelectedMethod(method?.description);
  }, [method]);

  const onSelectMethod = (methodName: string) => {
    if (activeElementEvent) {
      setSelectedMethod(methodName);
      // 从 schema 中获取 flowGraphData
      const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
        schema!,
        `${elementId}::${methodName}`,
      );
      // 设置 flowGraphData
      setFlowGraphData(flowGraphData);
      // 找到对应的 method 并且更新到 activeElementEvent
      const findMethod = material?.contextConfig?.methods?.find((item) => item.name === methodName);
      setActiveElementEvent({
        ...activeElementEvent,
        method: findMethod,
      });
      // 重新加载 document
      clientContext.document.reload(flowGraphData);
    }
  };

  return (
    <div
      className={cn(
        'px-2 h-[37px] flex items-center text-sm text-slate-800 border-b border-slate-300 bg-gray-50',
        {
          hidden: !activeElementEvent,
        },
      )}
    >
      <span className='mr-2'>{`${material?.title}`}</span>
      <Select
        className='w-40'
        size='small'
        variant='underlined'
        value={selectedMethod}
        onChange={onSelectMethod}
        options={material?.contextConfig?.methods?.map((item) => ({
          label: item.description,
          value: item.name,
        }))}
      />
    </div>
  );
};
