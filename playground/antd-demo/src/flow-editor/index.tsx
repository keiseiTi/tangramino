import React, { useEffect, useRef } from 'react';
import { uniqueId, useEditorCore } from '@tangramino/core';
import {
  FlowEditor as BaseFlowEditor,
  EditorRenderer,
  type FlowGraphData,
} from '@tangramino/flow-editor';
import { message } from 'antd';
import { SchemaUtils } from '@tangramino/engine';
import { transformFlowGraph2Flow } from '@/utils';
import { useEditorContext, type ActiveElementEvent } from '@/hooks/use-editor-context';
import { NodePanel } from './mods/node-panel';
import { AttributePanel } from './mods/attribute-panel';
import { nodes } from './nodes';
import { Operation } from './mods/operation';

export interface FlowEditorProps {
  className?: string;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { className } = props;
  const { schema, setSchema } = useEditorCore();
  const { flowGraphData, activeElementEvent } = useEditorContext();

  const activeElementEventRef = useRef<ActiveElementEvent | null>(null);
  const schemaRef = useRef(schema);

  useEffect(() => {
    activeElementEventRef.current = activeElementEvent;
  }, [activeElementEvent]);

  useEffect(() => {
    schemaRef.current = schema;
  }, [schema]);

  const changeFlowGraphData = (data: FlowGraphData) => {
    if (activeElementEventRef.current && activeElementEventRef.current?.method) {
      const { elementId, method } = activeElementEventRef.current;
      const bindElementKey = elementId + '::' + method?.name;
      const flowId =
        schemaRef.current.bindElements?.find((item) => item.id === elementId)?.flowId ||
        uniqueId('flow');
      let nextSchema = SchemaUtils.setFlowGraph(schemaRef.current, bindElementKey, data);
      nextSchema = SchemaUtils.setEventFlow(
        nextSchema,
        elementId,
        method?.name,
        flowId,
        transformFlowGraph2Flow(data),
      );
      setSchema(nextSchema);
    } else {
      message.info('请先选择元素');
    }
  };

  return (
    <div className={className}>
      <BaseFlowEditor nodes={nodes} value={flowGraphData} onChange={changeFlowGraphData}>
        <div className='flex h-full'>
          <NodePanel nodes={nodes} />
          <div className='flex-1 flex flex-col'>
            <Operation />
            <EditorRenderer className='flex-1 relative' />
          </div>
          <AttributePanel />
        </div>
      </BaseFlowEditor>
    </div>
  );
};
