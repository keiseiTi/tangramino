import { useEffect, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore } from '@tangramino/base-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useDefaultEvent = () => {
  const { schema, materials } = useEditorCore();
  const { activeElementEvent, setActiveElementEvent, setFlowGraphData } = useEditorContext();
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    const rootId = schema.layout.root;
    if (!rootId) return;
    const rootElement = schema.elements[rootId];
    const basicPageMaterial = materials.find((material) => material.type === rootElement.type);
    const method = basicPageMaterial?.contextConfig?.methods?.[0];
    if (!basicPageMaterial || !method || activeElementEvent) return;

    setActiveElementEvent({
      elementId: rootId,
      material: basicPageMaterial,
      method,
    });

    const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
      schema!,
      `${rootId}::${method.name}`,
    );
    setFlowGraphData(flowGraphData);
    setForceUpdate(forceUpdate + 1);
  }, [materials, activeElementEvent, setActiveElementEvent, setFlowGraphData]);

  return { forceUpdate, setForceUpdate };
};
