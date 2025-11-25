import React from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useDroppable } from '@dnd-kit/core';
import { useEditorCore, type ActiveElement } from '../hooks/use-editor-core';
import { Placeholder, type DropPlaceholderProps } from './placeholder';
import type { Material, MaterialComponentProps } from '../interface/material';
import { usePluginCore } from 'src/hooks/use-plugin-core';

interface EnhancedCompProps {
  material: Material;
  elementProps: Record<string, unknown>;
  renderComponent: (extraProps: MaterialComponentProps) => React.ReactNode;
  renderDropIndicator?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ElementWrapper = React.forwardRef<HTMLDivElement, EnhancedCompProps>(
  (props: EnhancedCompProps, ref) => {
    const { material, elementProps, className, renderComponent, renderDropIndicator, onClick } =
      props;
    const { schema, activeElement, setActiveElement, engine, materials, insertPosition } =
      useEditorCore();

    const { activateElement } = usePluginCore();

    const elementId = elementProps['data-element-id'] as string;

    const { setNodeRef } = useDroppable({
      id: elementId,
      data: {
        id: elementId,
        props: elementProps,
        position: insertPosition?.position,
        material,
      },
    });

    const onSelectElement = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.(e);
      if (activeElement?.id !== elementId) {
        const parents = SchemaUtils.getParents(schema!, elementId);
        const parentElements: ActiveElement[] = [];
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

        activateElement(
          {
            id: elementId,
            type: material.type,
            props: elementProps,
            material,
          },
          parentElements,
        );

        setActiveElement({
          id: elementId,
          type: material.type,
          props: elementProps,
          material,
          parents: parentElements,
        });
      }
    };

    const extraCompProps: MaterialComponentProps = material.isContainer
      ? {
          tg_dropPlaceholder: (
            <Placeholder
              elementProps={elementProps}
              material={material}
              onSelected={onSelectElement}
              renderDropPlaceholder={renderDropIndicator}
              insertPosition={insertPosition}
            />
          ),
          tg_mode: 'design',
        }
      : {
          tg_mode: 'design',
        };

    const setRef = (el: HTMLDivElement) => {
      setNodeRef(el);

      if (ref) {
        if (typeof ref === 'function') {
          ref(el);
        } else {
          ref.current = el;
        }
      }
    };

    return (
      <div
        ref={setRef}
        data-element-id={elementId}
        onClick={onSelectElement}
        className={className}
        style={
          !material.isContainer
            ? {
                display: 'inline-block',
              }
            : undefined
        }
      >
        {renderComponent(extraCompProps)}
      </div>
    );
  },
);

ElementWrapper.displayName = 'ElementWrapper';
