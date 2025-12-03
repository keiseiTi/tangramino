import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '../view';

describe('ReactView', () => {
  const TextComponent = ({ text }: { text?: string }) => <div>{text}</div>;
  const ContainerComponent = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  const components: Record<string, React.ComponentType<{ text?: string; children?: React.ReactNode }>> = {
    text: TextComponent,
    container: ContainerComponent,
  };

  it('should render components based on schema', () => {
    const schema = {
      elements: {
        root: { id: 'root', type: 'container', props: {} },
        child1: { id: 'child1', type: 'text', props: { text: 'Hello World' } },
      },
      layout: {
        root: 'root',
        structure: {
          root: ['child1'],
        },
      },
      extensions: {},
    };

    const engine = createEngine(schema);

    render(<ReactView engine={engine} components={components} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should update view when schema/state changes', async () => {
    const schema = {
        elements: {
          root: { id: 'root', type: 'container', props: {} },
          child1: { id: 'child1', type: 'text', props: { text: 'Initial' } },
        },
        layout: {
          root: 'root',
          structure: {
            root: ['child1'],
          },
        },
        extensions: {},
      };

      const engine = createEngine(schema);

    render(<ReactView engine={engine} components={components} />);

    expect(screen.getByText('Initial')).toBeInTheDocument();

      // Update state
      act(() => {
        engine.setState({ child1: { text: 'Updated' } });
      });

      // Wait for re-render if necessary, or check if it's synchronous (likely depends on listener)
      // React state updates are async usually.

      // Since ReactView subscribes to engine updates, it should re-render.
      // We might need to wait for it.

      expect(await screen.findByText('Updated')).toBeInTheDocument();
  });
});
