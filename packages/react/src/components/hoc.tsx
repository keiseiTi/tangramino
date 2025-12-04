import React, { useMemo } from 'react';
import type { Engine, Listener } from '@tangramino/engine';
import { ErrorBoundary } from './error-boundary';

interface ElementWrapperProps {
  id: string;
  engine: Engine;
  Comp: React.ComponentType;
  data: Record<string, unknown>;
  hidden?: boolean | undefined;
  children?: React.ReactNode;
  renderProps?: Record<string, unknown>;
}

export const ElementWrapper = React.memo(
  ({ id, engine, Comp, data, hidden = false, children, renderProps }: ElementWrapperProps) => {
    const { injectionCallback } = engine;
    const callbacks = injectionCallback[id];

    const composeEvent = useMemo(() => {
      const events: Record<string, Listener> = {};
      Object.keys(callbacks || {}).forEach((name) => {
        if (callbacks?.[name] && callbacks[name].length) {
          events[name] = (...args: unknown[]) => {
            let returnVal: unknown;
            callbacks[name]?.forEach((event) => {
              const value = event(...args) as unknown;
              if (returnVal) {
                console.warn(
                  'Sorry, There are multiple injectCallback return values, but only the first one is returned.',
                );
              } else {
                returnVal = value;
              }
            });
            return returnVal;
          };
        }
      });
      return events;
    }, [callbacks]);

    if (hidden) return null;

    const attribute = {
      'data-element-id': id,
    };

    return (
      <ErrorBoundary>
        <Comp {...attribute} {...renderProps} {...composeEvent} {...data}>
          {children}
        </Comp>
      </ErrorBoundary>
    );
  },
);

ElementWrapper.displayName = 'ElementWrapper';
