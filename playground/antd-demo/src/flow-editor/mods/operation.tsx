import React, { useEffect, useState } from 'react';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn } from '@/utils';
import { Select } from 'antd';
import { SchemaUtils } from '@tangramino/engine';
import { uniqueId, useEditorCore } from '@tangramino/base-editor';
import { useClientContext, type FlowGraphData } from '@tangramino/flow-editor';

export const Operation = () => {
  const { activeElementEvent, setFlowGraphData, setActiveElementEvent } = useEditorContext();
  const { schema, materials } = useEditorCore();
  const { elementId, material, method } = activeElementEvent || {};
  const [selectedMethod, setSelectedMethod] = useState<string>();
  const clientContext = useClientContext();

  useEffect(() => {
    setSelectedMethod(method?.description);
  }, [method]);

  const onSelectElement = (elementId: string) => {
    if (elementId === activeElementEvent?.elementId) {
      return;
    }
    const nextElement = schema?.elements[elementId];
    const nextMaterial = materials.find((material) => material.type === nextElement?.type)!;
    const nextMaterialMethods = nextMaterial.contextConfig?.methods;
    if (nextMaterialMethods?.length) {
      const firstMethod = nextMaterialMethods[0];
      const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
        schema!,
        `${elementId}::${firstMethod.name}`,
      ) || {
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
      };
      setFlowGraphData(flowGraphData);
      setSelectedMethod(firstMethod.name);
      setActiveElementEvent({
        elementId: elementId,
        material: nextMaterial,
        method: firstMethod,
      });
      clientContext.document.reload(flowGraphData);
    }
  };

  const onSelectMethod = (methodName: string) => {
    if (activeElementEvent) {
      setSelectedMethod(methodName);
      const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
        schema!,
        `${elementId}::${methodName}`,
      ) || {
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
      };
      setFlowGraphData(flowGraphData);
      const findMethod = material?.contextConfig?.methods?.find((item) => item.name === methodName);
      setActiveElementEvent({
        ...activeElementEvent,
        method: findMethod,
      });
      clientContext.operation.fromJSON(flowGraphData);
    }
  };

  return (
    <div
      className={cn('h-[35px] px-3 flex items-center text-sm text-slate-800 bg-white', {
        hidden: !activeElementEvent,
      })}
    >
      <Select
        className='w-40'
        size='small'
        variant='underlined'
        style={{ marginRight: 12 }}
        value={material?.title}
        onChange={onSelectElement}
        options={Object.keys(schema.elements).map((id) => ({
          label: materials.find((material) => material.type === schema.elements[id].type)?.title,
          value: id,
        }))}
      />
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
