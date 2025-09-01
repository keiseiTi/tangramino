import React, { useEffect, useMemo } from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';
import { EnhancedComp } from './enhanced-comp';
import BasicPageMaterial from './basic-page';
import { useEditorStore } from '../hooks/editor';
import { cn } from '../utils';
import type { Material } from '../interface/material';

interface CanvasEditorProps {
  className?: string;
  materials?: Material[];
}
export const CanvasEditor = (props: CanvasEditorProps) => {
  const { className, materials } = props;
  const { schema } = useEditorStore();
  const engine = useMemo(() => createEngine(schema), [schema]);

  useEffect(() => {
    engine.changeSchema(schema);
  }, [schema]);

  const materialsWithBasicPage = useMemo(() => {
    return [BasicPageMaterial, ...(materials || [])];
  }, [materials]);

  const components = useMemo(() => {
    return materialsWithBasicPage.reduce(
      (acc, cur) => {
        if (cur.Component) {
          const Comp = cur.Component as React.ComponentType<Record<string, unknown>>;
          acc[cur.type] = (props: Record<string, unknown>) => (
            <EnhancedComp
              elementProps={props}
              material={cur}
              materials={materialsWithBasicPage}
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
  }, [materialsWithBasicPage]);

  return (
    <div className={cn('p-4 bg-gray-50', className)}>
      <ReactView engine={engine} components={components} />
    </div>
  );
};
