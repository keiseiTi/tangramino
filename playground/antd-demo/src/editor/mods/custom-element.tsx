import React from 'react';
import { useEditorCore, type EnhancedComponentProps } from '@tangramino/base-editor';
import { useShallow } from 'zustand/react/shallow';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn, isPortal } from '@/utils';

export const CustomElement = (props: EnhancedComponentProps) => {
  const { material, elementProps, children } = props;
  const elementId = elementProps['data-element-id'] as string;

  const { activeElement } = useEditorCore(
    useShallow((state) => ({
      activeElement: state.activeElement,
    })),
  );

  const { setActiveElementEvent } = useEditorContext();

  const isSelected = activeElement?.id === elementId;

  const onSelectElement = () => {
    const methods = material.contextConfig?.methods || [];
    setActiveElementEvent({
      elementId,
      material,
      method: methods?.[0],
    });
  };

  if (isPortal(material.type)) {
    return React.cloneElement(children, {
      onClick: () => {
        onSelectElement();
      },
    });
  }

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelectElement();
    },
    className: cn(children.props.className, {
      'border-2 border-blue-600': isSelected,
    }),
  });
};
