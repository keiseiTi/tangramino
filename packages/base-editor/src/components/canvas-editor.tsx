import React, { useEffect, useMemo } from 'react';
import { ReactView } from '@tangramino/react';
import { EnhancedComp } from './enhanced-comp';
import { useEditorCore } from '../hooks/use-editor-core';
import type { Material } from '../interface/material';
import type { DropPlaceholderProps } from './placeholder';

export interface EnhancedComponentProps {
  children: React.ReactElement;
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

/**
 * Higher-Order Component to enhance material components with editor functionality
 */
const withEnhancement = (
  Comp: React.ComponentType<Record<string, unknown>>,
  material: Material,
  renderDropPlaceholder?: ((props: DropPlaceholderProps) => React.ReactNode) | undefined,
) => {
  const EnhancedComponent = (props: Record<string, unknown>) => (
    <EnhancedComp
      elementProps={props}
      material={material}
      renderComp={(extraProps: Record<string, unknown>) => (
        <Comp {...props} {...extraProps} />
      )}
      renderDropPlaceholder={renderDropPlaceholder}
    />
  );

  EnhancedComponent.displayName = `withEnhancement(${material.type})`;

  return EnhancedComponent;
};

export const CanvasEditor = (props: CanvasEditorProps) => {
  const { className, renderComponent, renderDropPlaceholder } = props;
  const { schema, materials, engine } = useEditorCore();

  useEffect(() => {
    engine.changeSchema(schema);
  }, [schema, engine]);

  const components = useMemo(() => {
    return (materials || []).reduce(
      (acc, cur) => {
        if (cur.Component) {
          const Comp = cur.Component as React.ComponentType<Record<string, unknown>>;
          // Use HOC pattern for component enhancement
          const EnhancedComponent = withEnhancement(Comp, cur, renderDropPlaceholder);

          acc[cur.type] = (props: Record<string, unknown>) => {
            if (renderComponent) {
              return renderComponent({
                children: <EnhancedComponent {...props} />,
                elementProps: props,
                material: cur,
              });
            }
            return <EnhancedComponent {...props} />;
          };
        }
        return acc;
      },
      {} as Record<string, React.ComponentType>,
    );
  }, [materials, renderComponent, renderDropPlaceholder]);

  return (
    <div className={className}>
      <ReactView engine={engine} components={components} />
    </div>
  );
};
