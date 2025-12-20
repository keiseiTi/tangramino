import React, { useMemo } from 'react';
import { Movable, useEditorCore, usePluginCore, type Method } from '@tangramino/base-editor';
import { Tooltip } from 'antd';
import { DeleteOutlined, DragOutlined, PartitionOutlined } from '@ant-design/icons';
import { cn } from '@/utils';
import { useLogicEvent } from '@/hooks/use-logic-event';
import { SchemaUtils } from '@tangramino/engine';

export const CustomOverlay = () => {
  const { activeElement, schema, setSchema, setActiveElement } = useEditorCore();
  const { beforeRemoveElement, afterRemoveElement } = usePluginCore();
  const { openFlow } = useLogicEvent();

  if (!activeElement) return;

  const { id, material } = activeElement;
  const methods = material.contextConfig?.methods || [];
  const rootId = schema?.layout?.root;

  const parents = useMemo(() => activeElement?.parents || [], [activeElement]);

  const parentMenus = useMemo(
    () =>
      parents.reverse().map((parent) => ({
        key: parent.id,
        label: parent.material.title,
      })),
    [parents],
  );

  const openFlowEditor = (method: Method, e: React.MouseEvent) => {
    e.stopPropagation();
    openFlow({
      elementId: id,
      method,
      material,
    });
  };

  const deleteElement = () => {
    beforeRemoveElement(schema!, id);
    const nextSchema = SchemaUtils.removeElement(schema!, id);
    afterRemoveElement(nextSchema);
    setSchema(nextSchema);
    setActiveElement(null);
  };

  const isBlock = material.isBlock || material.isContainer;

  const titleStyle: React.CSSProperties = {};

  if (isBlock) {
    titleStyle.top = -24;
    titleStyle.left = 0;
  } else {
    titleStyle.bottom = -24;
    titleStyle.right = 0;
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          background: '#1677ff',
          color: 'white',
          padding: '2px 8px',
          fontSize: 12,
          borderRadius: '2px 2px 0 0',
          pointerEvents: 'auto',
          ...titleStyle,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip
          title={parentMenus.map((item) => (
            <div
              key={item.label}
              className={cn('text-xs text-gray-100 cursor-pointer hover:text-blue-400 mb-1')}
            >
              <span>{item.label}</span>
            </div>
          ))}
          zIndex={11000}
        >
          <span className='cursor-pointer'>{material.title}</span>
        </Tooltip>
      </div>
      <div
        className='flex justify-center select-none'
        style={{
          position: 'absolute',
          top: -24,
          right: 0,
          background: '#1677ff',
          color: 'white',
          padding: '2px 8px',
          fontSize: 12,
          borderRadius: '2px 2px 0 0',
          display: rootId === id ? 'none' : 'flex',
          pointerEvents: 'auto',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip
          styles={{
            body: {
              padding: '8px 8px 4px 8px',
            },
          }}
          zIndex={11000}
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
            className={cn({
              'hidden!': !methods.length,
            })}
          />
        </Tooltip>
        <Movable className={cn('ml-2 pl-2 cursor-move border-l border-gray-400')}>
          <DragOutlined />
        </Movable>
        <span
          className={cn('ml-2 pl-2 cursor-pointer border-l border-gray-400')}
          onClick={deleteElement}
        >
          <DeleteOutlined />
        </span>
      </div>
    </>
  );
};
