import React, { useMemo } from 'react';
import { createEngine, type Schema } from '@tangramino/engine';
import { ReactView, type Plugin } from '@tangramino/react';

export interface RendererProps {
  schema: Schema;
  className?: string;
  plugins?: Plugin[];
  components?: {
    [key: string]: React.ComponentType<any>;
  };
}

/**
 * 渲染器组件，用于根据 schema 渲染组件
 * @param props - 组件属性
 * @returns React 组件
 */
export const Renderer: React.FC<RendererProps> = (props) => {
  const { schema, className, plugins, components } = props;
  // 创建引擎实例
  const engine = useMemo(() => {
    return createEngine(schema);
  }, [schema]);

  return (
    <div className={className}>
      <ReactView engine={engine} components={components} plugins={plugins} />
    </div>
  );
};
