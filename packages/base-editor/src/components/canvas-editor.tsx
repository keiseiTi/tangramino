import React, { useEffect, useMemo } from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';
import { EnhancedComp } from './enhanced-comp';
import { useEditorStore } from '../hooks/editor';

interface CanvasEditorProps {
  className?: string;
}
export const CanvasEditor = (props: CanvasEditorProps) => {
  const { className } = props;
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
          acc[cur.type] = (props: Record<string, unknown>) => (
            <EnhancedComp
              elementProps={props}
              material={cur}
              renderComp={(extraProps: Record<string, unknown>) => (
                <Comp {...props} {...extraProps} />
              )}
            />
          );
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
