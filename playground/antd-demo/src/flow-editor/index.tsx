import React from 'react';
import { uniqueId, useEditorCore } from '@tangramino/core';
import {
  FlowEditor as BaseFlowEditor,
  EditorRenderer,
  type FlowGraphData,
} from '@tangramino/flow-editor';
import { message } from 'antd';
import { SchemaUtils } from '@tangramino/engine';
import { transformFlowGraph2Flow } from '@/utils';
import { useEditorContext } from '@/hooks/use-editor-context';
import { NodePanel } from './mods/node-panel';
import { AttributePanel } from './mods/attribute-panel';
import { nodes } from './nodes';


export interface FlowEditorProps {
  className?: string;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { className } = props;

  const { schema, setSchema } = useEditorCore();
  const { flowGraphData, activeElementEvent } = useEditorContext();

  const changeFlowGraphData = (data: FlowGraphData) => {
    if (activeElementEvent) {
      const { elementId, event } = activeElementEvent;
      const bindElementKey = elementId + '::' + event;
      const flowId = schema.bindElements?.[bindElementKey] || uniqueId('flow');
      let nextSchema = SchemaUtils.setFlowGraph(schema, elementId, event, data);
      nextSchema = SchemaUtils.setEventFlow(
        nextSchema,
        elementId,
        event,
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
          <EditorRenderer className='flex-1 relative' />
          <AttributePanel />
        </div>
      </BaseFlowEditor>
    </div>
  );
};
