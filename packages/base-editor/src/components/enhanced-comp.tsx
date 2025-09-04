import React from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore, type activeElement } from '../hooks/editor';
import { Placeholder, type DropPlaceholderProps } from './placeholder';
import type { Material } from '../interface/material';
interface EnhancedCompProps {
  material: Material;
  elementProps: Record<string, unknown>;
  renderComp: (extraProps: Record<string, unknown>) => React.ReactNode;
  renderDropPlaceholder?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined;
}

export const EnhancedComp = (props: EnhancedCompProps) => {
  const { material, elementProps, renderComp, renderDropPlaceholder } = props;
  const { activeElement, setActiveElement, engine, materials, insertPosition } = useEditorStore();

  const elementId = elementProps['data-element-id'] as string;

  const { setNodeRef } = useDroppable({
    id: elementId,
    data: {
      id: elementId,
      props: elementProps,
      position: insertPosition?.position,
    },
  });

  const schema = engine?.getSchema();

  const selectedElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeElement?.id !== elementId) {
      const parents = SchemaUtils.getParents(schema!, elementId);
      const parentElements: activeElement[] = [];
      if (engine?.elements) {
        Object.keys(engine.elements || {}).forEach((id) => {
          if (parents.includes(id)) {
            parentElements.push({
              id,
              type: engine.elements[id]!.type,
              props: engine.elements[id]!.props,
              material: materials.find((m) => m.type === engine.elements[id]!.type)!,
            });
          }
        });
      }

      setActiveElement({
        id: elementId,
        type: material.type,
        props: elementProps,
        material,
        parents: parentElements,
      });
    }
  };

  const extraCompProps = material.isContainer
    ? {
        dropPlaceholder: (
          <Placeholder
            elementProps={elementProps}
            material={material}
            onSelected={selectedElement}
            renderDropPlaceholder={renderDropPlaceholder}
          />
        ),
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      data-editor-id={elementId}
      onClick={selectedElement}
      style={
        !material.isContainer
          ? {
              display: 'inline-block',
            }
          : undefined
      }
    >
      {renderComp(extraCompProps)}
    </div>
  );
};
