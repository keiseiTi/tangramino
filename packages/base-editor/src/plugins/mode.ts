import type { Engine } from '@tangramino/engine';
import { type Plugin } from '@tangramino/react';

export const modePlugin =
  (mode: 'edit' | 'render'): Plugin =>
  (engine: Engine) => {
    const elements = engine.elements;
    Object.keys(elements).forEach((id) => {
      engine.setState({
        [id]: {
          tg_mode: mode,
        },
      });
    });
  };
