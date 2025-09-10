import React, { useEffect, useMemo } from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';
import { EnhancedComp } from './enhanced-comp';
import { useEditorStore } from '../hooks/editor';
import type { Material } from '../interface/material';
import type { DropPlaceholderProps } from './placeholder';

export interface EnhancedComponentProps<T = unknown> {
  children: React.ReactElement<T>;
  elementProps: Record<string, unknown>;
  material: Material;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface CanvasEditorProps {
  className?: string;
  renderComponent?: (props: EnhancedComponentProps) => React.ReactNode;
  renderDropPlaceholder?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined;
}

export const CanvasEditor = (props: CanvasEditorProps) => {
  const { className, renderComponent, renderDropPlaceholder } = props;
  const { schema, materials } = useEditorStore();
  const engine = useMemo(() => createEngine(schema), [schema]);

  useEffect(() => {
    engine.changeSchema(schema);
  }, [schema]);

  const components = useMemo(() => {
    return (materials || []).reduce(
      (acc, cur) => {
        if (cur.Component) {
          const Comp = cur.Component as React.ComponentType<Record<string, unknown>>;
          acc[cur.type] = (props: Record<string, unknown>) => {
            const enhancedComp = (
              <EnhancedComp
                elementProps={props}
                material={cur}
                renderComp={(extraProps: Record<string, unknown>) => (
                  <Comp {...props} {...extraProps} />
                )}
                renderDropPlaceholder={renderDropPlaceholder}
              />
            );
            if (renderComponent) {
              return renderComponent({
                children: enhancedComp,
                elementProps: props,
                material: cur,
              });
            }
            return enhancedComp;
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
