import React, { useEffect, useMemo } from 'react';
import { ReactView } from '@tangramino/react';
import { ElementWrapper } from './element-wrapper';
import { useEditorCore } from '../hooks/use-editor-core';
import type { Material, MaterialComponentProps } from '../interface/material';
import { type DropPlaceholderProps } from './placeholder';

export interface EnhancedComponentProps {
  children: React.ReactElement;
  elementProps: Record<string, unknown>;
  material: Material;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface CanvasEditorProps {
  className?: string;
  renderElement?: (props: EnhancedComponentProps) => React.ReactNode;
  renderDropIndicator?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined;
}

export const CanvasEditor = (props: CanvasEditorProps) => {
  const { className, renderElement, renderDropIndicator } = props;
  const { schema, materials, engine } = useEditorCore();

  useEffect(() => {
    engine.changeSchema(schema);
  }, [schema]);

  const components = useMemo(() => {
    return (materials || []).reduce(
      (acc, cur) => {
        if (cur.Component) {
          const Comp = cur.Component as React.ComponentType<Record<string, unknown>>;
          acc[cur.type] = (props: Record<string, unknown>) => {
            const element = (
              <ElementWrapper
                elementProps={props}
                material={cur}
                renderComponent={(extraProps: MaterialComponentProps) => {
                  return <Comp {...props} {...extraProps} />;
                }}
                renderDropIndicator={renderDropIndicator}
              />
            );
            if (renderElement) {
              return renderElement({
                children: element,
                elementProps: props,
                material: cur,
              });
            }
            return element;
          };
        }
        return acc;
      },
      {} as Record<string, React.ComponentType>,
    );
  }, [materials]);

  return (
    <div className={className}>
      <ReactView engine={engine} components={components} />
    </div>
  );
};
