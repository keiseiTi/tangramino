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

export const ElementWrapper = React.forwardRef<HTMLDivElement, EnhancedCompProps>((props, ref) => {
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

  const setRef = (el: HTMLElement | null) => {
    setNodeRef(el);

    if (ref && el) {
      if (typeof ref === 'function') {
        ref(el as unknown as HTMLDivElement);
      } else {
        ref.current = el as unknown as HTMLDivElement;
      }
    }
  };

  const isInline = !material.isBlock && !material.isContainer;

  const wrapperStyle: React.CSSProperties = isInline
    ? {
        display: 'inline-block',
      }
    : {};

  const extraCompProps: MaterialComponentProps = {
    tg_mode: 'design',
    tg_ref: setRef,
    onClick: onSelectElement,
    'data-element-id': elementId,
    className,
    style: wrapperStyle,
    ...(material.isContainer
      ? {
          tg_dropPlaceholder: (
            <Placeholder
              elementProps={elementProps}
              material={material}
              onSelected={onSelectElement}
              renderDropPlaceholder={renderDropIndicator}
            />
          ),
        }
      : {}),
  };

  return renderComponent(extraCompProps);
});

ElementWrapper.displayName = 'ElementWrapper';
