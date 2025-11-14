import { useCallback, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore } from '@tangramino/base-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useDefaultEvent = () => {
  const { schema, materials } = useEditorCore();
  const { setActiveElementEvent, setFlowGraphData } = useEditorContext();
  const [forceUpdate, setForceUpdate] = useState<number>(0);

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

  return { ensureLogicEvent, forceUpdate, setForceUpdate };
};
