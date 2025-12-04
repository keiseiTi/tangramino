import { useEffect, useState, useRef } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore, type Method } from '@tangramino/base-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import type { FlowGraphData } from '@tangramino/flow-editor';

export const useDefaultEvent = () => {
  const { schema, materials } = useEditorCore();
  const { activeElementEvent, setActiveElementEvent, setFlowGraphData } = useEditorContext();
  // Use a counter to force update, but only when necessary
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // Keep track of the current active event ID to avoid unnecessary updates
  const currentEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    let elementId: string;
    let method: Method | undefined;

    if (!activeElementEvent) {
      // Initialize default selection if none exists
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
      return; // Let the next effect run with the new activeElementEvent
    } else {
      elementId = activeElementEvent.elementId;
      method = activeElementEvent.method;
    }

    if (!method) return;

    const eventKey = `${elementId}::${method.name}`;

    // Only update if the event key has changed
    if (currentEventIdRef.current !== eventKey) {
      const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
        schema!,
        eventKey
      );

      setFlowGraphData(flowGraphData);
      setForceUpdate(prev => prev + 1);
      currentEventIdRef.current = eventKey;
    }
  }, [materials, activeElementEvent, setActiveElementEvent, setFlowGraphData, schema]);

  return { forceUpdate };
};
