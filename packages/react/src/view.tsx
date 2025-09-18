import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ELEMENT_UPDATE, VIEW_UPDATE, type LayoutNode, type Engine } from '@tangramino/engine';
import { HocComponent } from './components/hoc';
import { useMounted } from './hooks/use-mounted';
import type { Plugin } from './plugin';

export interface ReactViewProps {
  engine: Engine;
  components?: {
    [name: string]: React.ComponentType;
  };
  plugins?: Plugin[];
}

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

  const isMounted = useMounted();

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

  if (!isMounted) {
    (plugins || []).forEach((plugin: Plugin) => plugin(engine));

    // const elements = engine.elements;
    // const enhanceComponent: Record<
    //   string,
    //   React.ComponentType<{
    //     data: Record<string, unknown>;
    //     hidden?: boolean | undefined;
    //   }>
    // > = {};
    // if (typeof components === 'object' && components != null) {
    //   Object.keys(elements).forEach((id: string) => {
    //     const { type } = elements[id]!;
    //     if (components[type]) {
    //       const Component = HocComponent({
    //         id,
    //         type,
    //         engine,
    //         Comp: components[type],
    //       });
    //       enhanceComponent[id] = Component;
    //     }
    //   });
    //   compMapElement.current = enhanceComponent;
    // }
  }

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
      // compMapElement.current = enhanceComponent;
      setCompMapElement(enhanceComponent);
    }
  }, [engine.elements, components]);

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
