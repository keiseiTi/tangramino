import type { Engine } from '@tangramino/engine';
import { type Plugin } from '@tangramino/react';

export const contextValuePlugin = (): Plugin => (engine: Engine) => {
  const elements = engine.elements;

  const setContextValue = (id: string, value: Record<string, unknown>) => {
    const contextValue = engine.getContextValue(id);
    engine.setContextValue(id, {
      ...contextValue,
      ...value,
    });
  };

  Object.keys(elements).forEach((id) => {
    engine.setState({
      [id]: {
        tg_setContextValues: (value: Record<string, unknown>) => {
          setContextValue(id, value);
        },
      },
    });
  });
};
