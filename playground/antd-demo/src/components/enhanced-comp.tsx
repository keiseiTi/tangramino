import React, { useEffect, useState } from 'react';
import {
  useEditorStore,
  usePluginStore,
  useMove,
  type EnhancedComponentProps,
} from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Popover } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { cn } from '../utils';

export const EnhancedComponent = (props: EnhancedComponentProps) => {
  const { material, elementProps, children } = props;
  const { activeElement, setActiveElement, schema, setSchema, insertPosition } = useEditorStore();
  const { beforeRemoveElement, afterRemoveElement } = usePluginStore();
  const elementId = elementProps['data-element-id'] as string;

  const MoveElement = useMove({ elementId, elementProps, material });
  const [popoverOpen, setPopoverOpen] = useState(false);

  const rootId = schema?.layout?.root;

  useEffect(() => {
    if (activeElement?.id === elementId) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  }, [activeElement, elementId]);

  const selectedElement = (_: React.MouseEvent) => {
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
          <MoveElement
            className={cn('px-2 cursor-move border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
          >
            <DragOutlined />
          </MoveElement>
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
        // @ts-ignore
        onClick: (e: React.MouseEvent) => {
          selectedElement(e);
        },
        className: cn({
          'border-2 border-blue-600': activeElement?.id === elementId,
          'inline-block': !material.isContainer,
          'border-l-4 border-yellow-500':
            !material.isContainer &&
            insertPosition?.id === elementId &&
            insertPosition.position === 'before',
          'border-r-4 border-yellow-500':
            !material.isContainer &&
            insertPosition?.id === elementId &&
            insertPosition.position === 'after',
        }),
      })}
    </Popover>
  );
};
