import { useCallback } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore } from '@tangramino/core';
import { useEditorContext } from '@/hooks/use-editor-context';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useDefaultEvent = (): { ensureLogicEvent: () => void } => {
  const { schema, materials } = useEditorCore();
  const { setActiveElementEvent, setFlowGraphData } = useEditorContext();

  const ensureLogicEvent = useCallback((): void => {
    const basicPage = SchemaUtils.getElementsByType(schema, 'basicPage')[0];
    if (!basicPage) return;

    const basicPageMaterial = materials.find((material) => material.type === basicPage.type);
    const method = basicPageMaterial?.contextConfig?.methods?.[0];
    if (!basicPageMaterial || !method) return;

    setActiveElementEvent({
      elementId: basicPage.id,
      material: basicPageMaterial,
      method,
    });

    const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
      schema!,
      `${basicPage.id}::${method.name}`,
    );
    setFlowGraphData(flowGraphData);
  }, [schema, materials, setActiveElementEvent, setFlowGraphData]);

  return { ensureLogicEvent };
};
