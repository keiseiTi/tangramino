import React, { useEffect, useState } from 'react';
import { Move, Trash } from 'lucide-react';
import { SchemaUtils } from '@tangramino/engine';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '../utils';
import { useEditorStore, type activeElement } from '../hooks/editor';
import { usePluginStore } from '../hooks/plugin';
import { Placeholder } from './placeholder';
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import type { Material } from '../interface/material';
interface EnhancedCompProps {
  material: Material;
  materials: Material[];
  elementProps: Record<string, unknown>;
  renderComp: (extraProps: Record<string, unknown>) => React.ReactNode;
}

export const EnhancedComp = (props: EnhancedCompProps) => {
  const { material, materials, elementProps, renderComp } = props;
  const { activeElement, setActiveElement, engine, setSchema, insertPosition } = useEditorStore();
  const { beforeRemoveElement, afterRemoveElement } = usePluginStore();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const elementId = elementProps['data-element-id'] as string;

  const {
    setNodeRef: setMoveNodeRef,
    listeners,
    attributes,
  } = useDraggable({
    id: elementId + '-move',
    data: {
      id: elementId,
      props: elementProps,
      material: material,
    },
  });

  const { setNodeRef } = useDroppable({
    id: elementId,
    data: {
      id: elementId,
      props: elementProps,
      position: insertPosition?.position,
    },
  });

  const schema = engine?.getSchema();
  const rootId = schema?.layout?.root;

  useEffect(() => {
    if (activeElement?.id === elementId) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  }, [activeElement, elementId]);

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

  const deleteElement = () => {
    beforeRemoveElement(schema!, elementId);
    const nextSchema = SchemaUtils.removeElement(schema!, elementId);
    afterRemoveElement(nextSchema);
    setSchema(nextSchema);
    setActiveElement(null);
  };

  const extraCompProps = material.isContainer
    ? {
        dropPlaceholder: (
          <Placeholder
            onSelected={selectedElement}
            elementProps={elementProps}
            material={material}
          />
        ),
      }
    : {};

  return (
    renderComp(extraCompProps)
    // <Popover open={popoverOpen}>
    //   <PopoverContent
    //     align='end'
    //     className='w-fit p-1 flex items-center select-none'
    //     onOpenAutoFocus={(e) => e.preventDefault()}
    //   >
    //     <span className='text-xs py-1 px-2'>{material.title}</span>
    //     <span
    //       ref={setMoveNodeRef}
    //       className={cn('py-1 px-2 cursor-move border-l border-gray-400', {
    //         hidden: activeElement?.id === rootId,
    //       })}
    //       {...listeners}
    //       {...attributes}
    //     >
    //       <Move size={14} />
    //     </span>
    //     <span
    //       className={cn('py-1 px-2 cursor-pointer border-l border-gray-400', {
    //         hidden: activeElement?.id === rootId,
    //       })}
    //       onClick={deleteElement}
    //     >
    //       <Trash size={14} />
    //     </span>
    //   </PopoverContent>
    //   <div
    //     data-editor-id={elementId}
    //     data-slot='tooltip-trigger'
    //     className={cn({
    //       'inline-block': !material.isContainer,
    //       'border-l-4 border-yellow-500':
    //         !material.isContainer &&
    //         insertPosition?.id === elementId &&
    //         insertPosition.position === 'before',
    //       'border-r-4 border-yellow-500':
    //         !material.isContainer &&
    //         insertPosition?.id === elementId &&
    //         insertPosition.position === 'after',
    //     })}
    //   >
    //     <PopoverTrigger asChild>
    //       <div
    //         ref={setNodeRef}
    //         data-editor-id={elementId}
    //         data-slot='tooltip-trigger'
    //         className={cn('cursor-default', {
    //           'inline-block': !material.isContainer,
    //           'border-2 border-blue-500': activeElement?.id === elementId,
    //         })}
    //         onClick={selectedElement}
    //       >
    //         {renderComp(extraCompProps)}
    //       </div>
    //     </PopoverTrigger>
    //   </div>
    // </Popover>
  );
};
