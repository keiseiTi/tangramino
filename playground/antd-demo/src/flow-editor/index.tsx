import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { uniqueId, useEditorCore } from '@tangramino/base-editor';
import { createFreeLinesPlugin } from '@flowgram.ai/free-lines-plugin';
import {
  FlowEditor as BaseFlowEditor,
  EditorRenderer,
  type FlowGraphData,
  type FlowEditorProps as BaseFlowEditorProps,
} from '@tangramino/flow-editor';
import { message } from 'antd';
import { SchemaUtils } from '@tangramino/engine';
import { transformFlowGraph2Flow } from '@/utils';
import { useDefaultEvent } from '@/hooks/use-default-event';
import { useEditorContext, type ActiveElementEvent } from '@/hooks/use-editor-context';
import { AttributePanel } from './mods/attribute-panel';
import { nodes } from './nodes';
import { OperationPanel } from './mods/operation-panel';
import { CustomLineLabel } from './mods/custom-line-label';

export interface FlowEditorProps {
  className?: string;
}

export const FlowEditor = (props: FlowEditorProps) => {
  const { className } = props;
  const { schema, setSchema } = useEditorCore();
  const { flowGraphData, activeElementEvent } = useEditorContext();

  const activeElementEventRef = useRef<ActiveElementEvent | null>(null);
  const schemaRef = useRef(schema);
  const { forceUpdate } = useDefaultEvent();

  useEffect(() => {
    activeElementEventRef.current = activeElementEvent;
  }, [activeElementEvent]);

  useEffect(() => {
    schemaRef.current = schema;
  }, [schema]);

  const changeFlowGraphData = useCallback((data: FlowGraphData) => {
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
  }, [setSchema]); // Use ref values so this doesn't need other deps

  const canAddLine: BaseFlowEditorProps['canAddLine'] = useCallback((_, fromPort) => {
    if (fromPort.node.flowNodeType === 'condition') {
      if (fromPort.availableLines.length >= 2) {
        return false;
      }
    } else if (fromPort.node.flowNodeType === 'action') {
      return false;
    }
    return true;
  }, []);

  const plugins = useMemo(() => [
    createFreeLinesPlugin({
      renderInsideLine: CustomLineLabel,
    }),
  ], []);

  return (
    <div className={className}>
      <BaseFlowEditor
        key={forceUpdate}
        nodes={nodes}
        value={flowGraphData}
        onChange={changeFlowGraphData}
        canAddLine={canAddLine}
        plugins={plugins}
      >
        <div className='flex h-full'>
          <div className='flex flex-col h-full'>
            <OperationPanel nodes={nodes} />
          </div>
          <div className='flex-1 flex flex-col'>
            <EditorRenderer className='flex-1 relative' />
          </div>
          <AttributePanel />
        </div>
      </BaseFlowEditor>
    </div>
  );
};
