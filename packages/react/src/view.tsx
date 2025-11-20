import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ELEMENT_UPDATE, VIEW_UPDATE, type LayoutNode, type Engine } from '@tangramino/engine';
import { HocComponent } from './components/hoc';
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
  const [compMapElement, setCompMapElement] = useState<
    Record<
      string,
      React.ComponentType<{
        data: Record<string, unknown>;
        hidden?: boolean | undefined;
        children?: React.ReactNode;
      }>
    >
  >({});

  const isMounted = useRef(false);

  if (!isMounted.current) {
    (plugins || []).forEach((plugin: Plugin) => plugin(engine));
    isMounted.current = true;
  }

  useLayoutEffect(() => {
    const unsubscribeFn = engine.subscribe(VIEW_UPDATE, () => {
      setElements(engine.elements);
    });
    return () => {
      unsubscribeFn();
    };
  }, [engine]);

  useLayoutEffect(() => {
    const unsubscribeFn = engine.subscribe(ELEMENT_UPDATE, () => {
      setElements({
        ...elements,
        ...engine.elements,
      });
    });
    return () => {
      unsubscribeFn();
    };
  }, [engine]);

  useEffect(() => {
    const elements = engine.elements;
    const enhanceComponent: Record<
      string,
      React.ComponentType<{
        data: Record<string, unknown>;
        hidden?: boolean | undefined;
      }>
    > = {};
    if (typeof components === 'object' && components != null) {
      Object.keys(elements).forEach((id: string) => {
        const { type } = elements[id]!;
        if (components[type]) {
          const Component = HocComponent({
            id,
            type,
            engine,
            Comp: components[type],
          });
          enhanceComponent[id] = Component;
        }
      });
      setCompMapElement(enhanceComponent);
    }
  }, [engine.elements, components]);

  // Sync elements state when engine.elements changes
  useEffect(() => {
    setElements(engine.elements);
  }, [engine.elements]);

  const render = (nodes: LayoutNode[]) => {
    return (
      nodes
        ?.map((node: LayoutNode) => {
          const id = node.id;
          const element = elements[id];
          const Component = compMapElement[id];
          if (!element || !Component) return null;
          if (Array.isArray(node.children) && node.children.length) {
            return (
              <Component key={id} data={element.props} hidden={element.hidden}>
                {render(node.children)}
              </Component>
            );
          } else {
            return <Component key={id} data={element.props} hidden={element.hidden} />;
          }
        })
        ?.filter((_) => _) || null
    );
  };

  const layouts = engine.layouts;

  return render(layouts);
};
