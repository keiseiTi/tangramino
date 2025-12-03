import React from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useDroppable } from '@dnd-kit/core';
import { useShallow } from 'zustand/react/shallow';
import { useEditorCore, type ActiveElement } from '../hooks/use-editor-core';
import { Placeholder, type DropPlaceholderProps } from './placeholder';
import type { Material, MaterialComponentProps } from '../interface/material';
import { usePluginCore } from '../hooks/use-plugin-core';

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
    const { schema, activeElement, setActiveElement, engine, materials } = useEditorCore(
      useShallow((state) => ({
        schema: state.schema,
        activeElement: state.activeElement,
        setActiveElement: state.setActiveElement,
        engine: state.engine,
        materials: state.materials,
      })),
    );

    const { activateElement } = usePluginCore();

    const elementId = elementProps['data-element-id'] as string;

    const { setNodeRef } = useDroppable({
      id: elementId,
      data: {
        id: elementId,
        props: elementProps,
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
          parents.forEach((id) => {
            const element = engine.elements[id];
            if (element) {
              parentElements.push({
                id,
                type: element.type,
                props: element.props,
                material: materials.find((m) => m.type === element.type)!,
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
