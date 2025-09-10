import React, { useEffect, useState } from 'react';
import {
  useEditorStore,
  usePluginStore,
  type ActiveElement,
  type EnhancedComponentProps,
} from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Popover } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { cn } from '../utils';

export const EnhancedComponent = (props: EnhancedComponentProps) => {
  const { material, elementProps, children } = props;
  const { activeElement, setActiveElement, engine, setSchema, insertPosition, materials } =
    useEditorStore();
  const { beforeRemoveElement, afterRemoveElement } = usePluginStore();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const elementId = elementProps['data-element-id'] as string;

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

  return (
    <Popover
      title={null}
      open={popoverOpen}
      arrow={false}
      placement='topLeft'
      styles={{
        body: {
          padding: '8px',
        },
      }}
      content={
        <div className='flex gap-2 text-xs'>
          <span>{material.title}</span>
          <span
            // ref={setMoveNodeRef}
            className={cn('py-1 px-2 cursor-move border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
            // {...listeners}
            // {...attributes}
          >
            <DragOutlined />
          </span>
          <span
            className={cn('py-1 px-2 cursor-pointer border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
            onClick={deleteElement}
          >
            <DeleteOutlined />
          </span>
        </div>
      }
    >
      {children}
    </Popover>
  );
};
