import type { Engine } from '@tangramino/engine';

const plugin = () => (engine: Engine) => {
  engine.injectCallback('increaseBtn', 'onClick', () => {
    const countTextState = engine.getState('countText') as { text: number };
    engine.setState({
      countText: {
        text: countTextState.text + 1,
      },
    });
  });
  engine.injectCallback('decreaseBtn', 'onClick', () => {
    const countTextState = engine.getState('countText') as { text: number };

    engine.setState({
      countText: {
        text: countTextState.text - 1,
      },
    });
  });
};

export default plugin;
