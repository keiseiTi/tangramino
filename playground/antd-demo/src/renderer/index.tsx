import React, { useMemo } from 'react';
import { createEngine, withFlowEngine, type LogicNodes, type Schema } from '@tangramino/engine';
import { ReactView, type Plugin } from '@tangramino/react';
import { useInitComp } from './use-init-comp';

export interface RendererProps {
  schema: Schema;
  className?: string;
  plugins?: Plugin[];
  components?: {
    [key: string]: React.ComponentType<any>;
  };
  logicNodes?: LogicNodes<any>;
}

/**
 * 渲染器组件，用于根据 schema 渲染组件
 * @param props - 组件属性
 * @returns React 组件
 */
export const Renderer: React.FC<RendererProps> = (props) => {
  const { schema, className, plugins, components, logicNodes } = props;

  const engine = useMemo(() => {
    const _ = createEngine(schema);
    withFlowEngine({ engine: _, schema, logicNodes });
    return _;
  }, []);

  const newComponents = useInitComp(components || {});

  return (
    <div className={className}>
      <ReactView engine={engine} components={newComponents} plugins={plugins} />
    </div>
  );
};
