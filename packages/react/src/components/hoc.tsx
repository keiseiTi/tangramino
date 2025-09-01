import React from 'react';
import type { Engine, Listener } from '@tangramino/engine';
import { ErrorBoundary } from './error-boundary';

export const HocComponent = ({
  id,
  type,
  engine,
  Comp,
}: {
  id: string;
  type: string;
  engine: Engine;
  Comp: React.ComponentType;
}) => {
  const { injectionCallback } = engine;

  const callbacks = injectionCallback[id];

  const composeEvent: Record<string, Listener> = {};
  Object.keys(callbacks || {}).forEach((name) => {
    if (callbacks?.[name] && callbacks[name].length) {
      composeEvent[name] = (...args: unknown[]) => {
        let returnVal: unknown;
        callbacks[name]?.forEach((event) => {
          const value = event(...args) as unknown;
          if (returnVal) {
            console.warn(
              'Sorry, There are multiple injectCallback return values, but only the first one is returned.'
            );
          } else {
            returnVal = value;
          }
        });
        return returnVal;
      };
    }
  });

  const Component: React.FC<{
    data: Record<string, unknown>;
    hidden?: boolean | undefined;
    children?: React.ReactNode;
    renderProps?: Record<string, unknown>;
  }> = (props) => {
    const { data, hidden = false, children, renderProps } = props;
    const attribute = {
      'data-element-id': id,
    };

    if (hidden) return null;

    const $comp = (
      <Comp {...attribute} {...renderProps} {...composeEvent} {...data}>
        {children}
      </Comp>
    );

    return <ErrorBoundary>{$comp}</ErrorBoundary>;
  };
  Component.displayName = `Element_${type}`;

  return React.memo(Component);
};
