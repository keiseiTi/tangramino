import React, { useMemo } from 'react';
import {
  useEditorCore,
  usePluginCore,
  type EnhancedComponentProps,
  type Method,
  Movable,
} from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Dropdown, Popover, Tooltip } from 'antd';
import { DeleteOutlined, DragOutlined, PartitionOutlined } from '@ant-design/icons';
import { useShallow } from 'zustand/react/shallow';
import { useEditorContext } from '@/hooks/use-editor-context';
import { cn } from '@/utils';
import { useLogicEvent } from '@/hooks/use-logic-event';

export const CustomElement = (props: EnhancedComponentProps) => {
  const { material, elementProps, children } = props;
  const elementId = elementProps['data-element-id'] as string;
  const methods = material.contextConfig?.methods || [];

  const { activeElement, setActiveElement, schema, setSchema } = useEditorCore(
    useShallow((state) => ({
      activeElement: state.activeElement,
      setActiveElement: state.setActiveElement,
      schema: state.schema,
      setSchema: state.setSchema,
    })),
  );

  const insertPosition = useEditorCore((state) =>
    state.insertPosition?.id === elementId ? state.insertPosition : null,
  );

  const { beforeRemoveElement, afterRemoveElement } = usePluginCore();
  const { mode, setActiveElementEvent } = useEditorContext();
  const { openFlow } = useLogicEvent();

  const rootId = schema?.layout?.root;

  // Derive open state directly from activeElement and mode
  const isSelected = activeElement?.id === elementId;
  const popoverOpen = isSelected && mode !== 'logic';

  const deleteElement = () => {
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

  const onSelectElement = () => {
    const methods = material.contextConfig?.methods || [];
    setActiveElementEvent({
      elementId,
      material,
      method: methods?.[0],
    });
  };

  const parents = useMemo(() => activeElement?.parents || [], [activeElement]);

  const parentMenus = useMemo(
    () =>
      parents.map((parent) => ({
        key: parent.id,
        label: parent.material.title,
      })),
    [parents],
  );

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
          <Movable
            elementId={elementId}
            elementProps={elementProps}
            material={material}
            className={cn('ml-2 pl-2 cursor-move border-l border-gray-400', {
              hidden: activeElement?.id === rootId,
            })}
          >
            <DragOutlined />
          </Movable>
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
        onClick: () => {
          onSelectElement();
        },
        className: cn({
          'border-2 border-blue-600': isSelected,
          'inline-block': !material.isContainer,
          'border-l-4 border-yellow-500':
            !material.isContainer &&
            insertPosition?.id === elementId &&
            insertPosition.position === 'before',
          'border-r-4 border-yellow-500':
            !material.isContainer &&
            insertPosition?.id === elementId &&
            insertPosition.position === 'after',
          'border-t-4 border-yellow-500':
            material.isContainer &&
            insertPosition?.id === elementId &&
            insertPosition.position === 'up',
          'border-b-4 border-yellow-500':
            material.isContainer &&
            insertPosition?.id === elementId &&
            insertPosition.position === 'down',
        }),
      })}
    </Popover>
  );
};
