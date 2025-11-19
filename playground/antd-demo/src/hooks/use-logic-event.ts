import React, { useCallback } from 'react';
import { useEditorContext } from './use-editor-context';
import { useEditorCore, type Material, type Method } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useLogicEvent = () => {
  const { schema } = useEditorCore();
  const { setMode, setLeftPanel, setFlowGraphData, setActiveElementEvent } = useEditorContext();
  const openFlow = useCallback(
    ({
      elementId,
      method,
      material,
    }: {
      elementId: string;
      method: Method;
      material: Material;
    }) => {
      const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
        schema!,
        `${elementId}::${method.name}`,
      );
      setFlowGraphData(flowGraphData);
      setActiveElementEvent({ elementId, method, material });
      setMode('logic');
      setLeftPanel('logic');
    },
    [],
  );

  return {
    openFlow,
  };
};
