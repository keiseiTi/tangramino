import React from 'react';
import { DragOverlay as DragOverlayCore } from '@dnd-kit/core';
import { useEditorCore } from '../hooks/use-editor-core';

interface DragOverlayProps {
  children: React.ReactNode;
}

export const DragOverlay = (props: DragOverlayProps) => {
  const { dragElement } = useEditorCore();

  return (
    <DragOverlayCore dropAnimation={null}>{dragElement ? props.children : null}</DragOverlayCore>
  );
};
