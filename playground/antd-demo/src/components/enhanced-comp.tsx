import React, { useEffect, useState } from 'react';
import {
  useEditorStore,
  usePluginStore,
  useMove,
  type EnhancedComponentProps,
} from '@tangramino/core';
import { SchemaUtils } from '@tangramino/engine';
import { Dropdown, Popover, Tooltip } from 'antd';
import { DeleteOutlined, DragOutlined, PartitionOutlined } from '@ant-design/icons';
import { cn } from '../utils';

export const EnhancedComponent = (props: EnhancedComponentProps) => {
  const { material, elementProps, children } = props;
  const elementId = elementProps['data-element-id'] as string;
  const eventFlows = material.editorConfig?.eventFlows || [];

  const { activeElement, setActiveElement, schema, setSchema, insertPosition } = useEditorStore();
  const { beforeRemoveElement, afterRemoveElement } = usePluginStore();
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

  const parentMenus = activeElement?.parents?.map((parent) => ({
    key: parent.id,
    label: parent.material.title,
  }));

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
          <Dropdown
            arrow={false}
            menu={{
              items: parentMenus,
            }}
          >
            <span>{material.title}</span>
          </Dropdown>
          <Tooltip
            styles={{
              body: {
                padding: '8px 8px 4px 8px',
              },
            }}
            title={eventFlows.map((flow) => (
              <div
                key={flow.event}
                className={cn('text-xs text-gray-100 cursor-pointer hover:text-blue-400 mb-1')}
              >
                <span>{flow.description}</span>
              </div>
            ))}
          >
            <PartitionOutlined
              className={cn('ml-2 pl-2 border-l border-gray-400', {
                'hidden!': !eventFlows.length,
              })}
            />
          </Tooltip>
          <MoveElement
            className={cn('ml-2 pl-2 cursor-move border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
          >
            <DragOutlined />
          </MoveElement>
          <span
            className={cn('ml-2 pl-2 cursor-pointer border-l border-gray-400', {
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
