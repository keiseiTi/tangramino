import { describe, it, expect, vi } from 'vitest';
import type { Plugin } from '../plugin';
import type { Engine } from '@tangramino/engine';

describe('React Plugin System', () => {
  it('should define plugin as a function', () => {
    const plugin: Plugin = (engine: Engine) => {
      // Plugin logic
      engine.on('view', 'UPDATE', () => {
        // Handle view updates
      });
    };

    expect(typeof plugin).toBe('function');
  });

  it('should allow plugin to access engine', () => {
    const mockEngine = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      getSchema: vi.fn(),
      setSchema: vi.fn(),
    } as unknown as Engine;

    const plugin: Plugin = (engine: Engine) => {
      engine.on('view', 'UPDATE', () => {});
    };

    plugin(mockEngine);

    expect(mockEngine.on).toHaveBeenCalledWith('view', 'UPDATE', expect.any(Function));
  });

  it('should support multiple plugins', () => {
    const mockEngine = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      getSchema: vi.fn(),
      setSchema: vi.fn(),
    } as unknown as Engine;

    const plugin1: Plugin = (engine) => {
      engine.on('view', 'UPDATE', () => {});
    };

    const plugin2: Plugin = (engine) => {
      engine.on('schema', 'UPDATE', () => {});
    };

    plugin1(mockEngine);
    plugin2(mockEngine);

    expect(mockEngine.on).toHaveBeenCalledTimes(2);
  });
});
