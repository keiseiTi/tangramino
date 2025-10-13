import React from 'react';
import { DragOverlay as DragOverlayCore } from '@dnd-kit/core';
import { useEditorCore } from '../hooks/use-editor-core';

export const DragOverlay = (props: { children: React.ReactNode }) => {
  const { dragElement } = useEditorCore();

  return (
    <DragOverlayCore dropAnimation={null}>{dragElement ? props.children : null}</DragOverlayCore>
  );
};
