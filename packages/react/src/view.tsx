import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { ELEMENT_UPDATE, VIEW_UPDATE, type LayoutNode, type Engine } from '@tangramino/engine';
import { ElementWrapper } from './components/hoc';
import type { Plugin } from './plugin';

/**
 * Props for the ReactView component
 */
export interface ReactViewProps {
  /** The engine instance to render */
  engine: Engine;
  /** Map of component types to their React components */
  components?: {
    [name: string]: React.ComponentType;
  };
  /** Optional plugins to enhance the view functionality */
  plugins?: Plugin[];
}

/**
 * ReactView component renders the engine's layout tree as React components
 * Automatically subscribes to engine updates and re-renders when changes occur
 *
 * @example
 * ```tsx
 * <ReactView
 *   engine={engine}
 *   components={{ Button: MyButton, Input: MyInput }}
 *   plugins={[myPlugin]}
 * />
 * ```
 */
export const ReactView = (props: ReactViewProps) => {
  const { engine, components, plugins } = props;
  const [elements, setElements] = useState(engine.elements);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      (plugins || []).forEach((plugin: Plugin) => plugin(engine));
      isMounted.current = true;
    }
  }, [engine, plugins]);

  useLayoutEffect(() => {
    const handleUpdate = () => {
      // Force update by creating a shallow copy
      setElements({ ...engine.elements });
    };

    const unsubscribeView = engine.subscribe(VIEW_UPDATE, handleUpdate);
    const unsubscribeElement = engine.subscribe(ELEMENT_UPDATE, handleUpdate);

    return () => {
      unsubscribeView();
      unsubscribeElement();
    };
  }, [engine]);

  const renderNode = useCallback(
    (node: LayoutNode): React.ReactNode => {
      const id = node.id;
      const element = elements[id];

      if (!element) return null;

      const Comp = components?.[element.type];
      if (!Comp) return null;

      const children =
        node.children && node.children.length > 0
          ? node.children.map((child) => renderNode(child))
          : null;

      return (
        <ElementWrapper
          key={id}
          id={id}
          engine={engine}
          Comp={Comp}
          data={element.props}
          hidden={element.hidden}
        >
          {children}
        </ElementWrapper>
      );
    },
    [elements, components, engine],
  );

  return <>{engine.layouts?.map((node) => renderNode(node))}</>;
};
