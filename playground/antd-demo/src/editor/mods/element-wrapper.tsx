import React, { useEffect, useState } from 'react';
import {
  useEditorCore,
  usePluginCore,
  useMove,
  type EnhancedComponentProps,
  type Method,
} from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Dropdown, Popover, Tooltip } from 'antd';
import { DeleteOutlined, DragOutlined, PartitionOutlined } from '@ant-design/icons';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn } from '@/utils';
import { useLogicEvent } from '@/hooks/use-logic-event';

export const ElementWrapper = (props: EnhancedComponentProps) => {
  const { material, elementProps, children } = props;
  const elementId = elementProps['data-element-id'] as string;
  const methods = material.contextConfig?.methods || [];

  const { mode } = useEditorContext();
  const { activeElement, setActiveElement, schema, setSchema, insertPosition } = useEditorCore();
  const { beforeRemoveElement, afterRemoveElement } = usePluginCore();
  const { openFlow } = useLogicEvent();
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

  useEffect(() => {
    if (mode === 'logic') {
      setPopoverOpen(false);
    }
  }, [mode]);

  const deleteElement = () => {
    setPopoverOpen(false);
    beforeRemoveElement(schema!, elementId);
    const nextSchema = SchemaUtils.removeElement(schema!, elementId);
    afterRemoveElement(nextSchema);
    setSchema(nextSchema);
    setActiveElement(null);
  };

  const openFlowEditor = (method: Method, e: React.MouseEvent) => {
    e.stopPropagation();
    openFlow({
      elementId,
      method,
      material,
    });
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
            title={methods.map((method) => (
              <div
                key={method.name}
                className={cn('text-xs text-gray-100 cursor-pointer hover:text-blue-400 mb-1')}
                onClick={openFlowEditor.bind(this, method)}
              >
                <span>{method.description}</span>
              </div>
            ))}
          >
            <PartitionOutlined
              className={cn('ml-2 pl-2 border-l border-gray-400', {
                'hidden!': !methods.length,
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
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
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
