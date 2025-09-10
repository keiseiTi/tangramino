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

export const EnhancedComponent = (props: EnhancedComponentProps<HTMLDivElement>) => {
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

  const selectedElement = () => {
    console.log('keiseiTi :>> ', '2', 2);
    setPopoverOpen(false);
  };

  const deleteElement = () => {
    setPopoverOpen(false);
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
      placement='topRight'
      styles={{
        body: {
          padding: '8px',
        },
      }}
      content={
        <div className='flex justify-center select-none'>
          <span className='pr-2'>{material.title}</span>
          <span
            // ref={setMoveNodeRef}
            className={cn('px-2 cursor-move border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
            // {...listeners}
            // {...attributes}
          >
            <DragOutlined />
          </span>
          <span
            className={cn('pl-2 cursor-pointer border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
            onClick={deleteElement}
          >
            <DeleteOutlined />
          </span>
        </div>
      }
    >
      {React.cloneElement(children, {
        onClick: selectedElement,
        className: cn({
          'border-2 border-blue-600': activeElement?.id === elementId,
        }),
      })}
    </Popover>
  );
};
