import React from 'react';
import { DragOverlay as DragOverlayCore } from '@dnd-kit/core';
import { useEditorStore } from '../hooks/use-editor';

export const DragOverlay = (props: { children: React.ReactNode }) => {
  const { dragElement } = useEditorStore();

  return (
    <DragOverlayCore dropAnimation={null}>{dragElement ? props.children : null}</DragOverlayCore>
  );
};
