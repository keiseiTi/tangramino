import React, { useEffect, useState } from 'react';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn } from '@/utils';
import { Select } from 'antd';
import { SchemaUtils } from '@tangramino/engine';
import { uniqueId, useEditorCore, type Material } from '@tangramino/core';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const Operation = () => {
  const { activeElementEvent, setFlowGraphData, setActiveElementEvent } = useEditorContext();
  const { schema } = useEditorCore();
  const { elementId, material, method } = activeElementEvent || {};
  const [selectedMethod, setSelectedMethod] = useState<string>();

  useEffect(() => {
    setSelectedMethod(method?.description);
  }, [method]);

  const onSelectMethod = (methodName: string) => {
    if (activeElementEvent) {
      setSelectedMethod(methodName);
      const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
        schema!,
        `${elementId}::${methodName}`,
      );
      setFlowGraphData(
        flowGraphData || {
          nodes: [
            {
              id: 'start_' + uniqueId(undefined, 8),
              type: 'start',
              meta: {
                position: { x: 0, y: 0 },
              },
              data: {},
            },
          ],
          edges: [],
        },
      );
      const findMethod = material?.contextConfig?.methods?.find((item) => item.name === methodName);
      setActiveElementEvent({
        ...activeElementEvent,
        method: findMethod,
      });
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
