import { useEffect, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore, type Method } from '@tangramino/base-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useDefaultEvent = () => {
  const { schema, materials } = useEditorCore();
  const { activeElementEvent, setActiveElementEvent, setFlowGraphData } = useEditorContext();
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    let elementId: string;
    let method: Method | undefined;
    if (!activeElementEvent) {
      elementId = schema.layout.root;
      const rootElement = schema.elements[elementId];
      const basicPageMaterial = materials.find((material) => material.type === rootElement.type);
      method = basicPageMaterial?.contextConfig?.methods?.[0];
      if (!basicPageMaterial) return;
      setActiveElementEvent({
        elementId: elementId,
        material: basicPageMaterial,
        method,
      });
    } else {
      elementId = activeElementEvent.elementId;
      method = activeElementEvent.method;
    }
    if (!method) return;
    const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
      schema!,
      `${elementId}::${method?.name}`,
    );
    setFlowGraphData(flowGraphData);
    setForceUpdate(forceUpdate + 1);
  }, [materials, activeElementEvent, setActiveElementEvent, setFlowGraphData]);

  return { forceUpdate, setForceUpdate };
};
