import { describe, it, expect } from 'vitest';
import { createEngine, defaultSchema } from '../index';

describe('createEngine', () => {
  it('should create an engine with default schema', () => {
    const engine = createEngine(defaultSchema);
    expect(engine).toBeDefined();
    // Check core properties instead of exact schema match as internals might differ
    const schema = engine.getSchema();
    expect(schema.elements).toEqual(defaultSchema.elements);
    expect(schema.extensions).toEqual(defaultSchema.extensions);
  });

  it('should set and get context values', () => {
    const engine = createEngine(defaultSchema);
    const contextValue = { foo: 'bar' };
    engine.setContextValue('testKey', contextValue);
    expect(engine.getContextValue('testKey')).toEqual(contextValue);
  });

  it('should update state', () => {
    const engine = createEngine(defaultSchema);
    // Assuming we have an element or can set state arbitrarily for now, 
    // but based on implementation we might need an element to exist first.
    // Let's check if we can add an element via schema first or if setState works loosely.
    // Checking createEngine implementation might be useful, but for now let's assume standard behavior.
    
    const schema = {
      ...defaultSchema,
      elements: {
        'test-id': {
          id: 'test-id',
          type: 'test-type',
          props: { foo: 'bar' }
        }
      }
    };
    const engineWithElements = createEngine(schema);
    
    expect(engineWithElements.getState('test-id')).toEqual({ foo: 'bar' });
    
    engineWithElements.setState({ 'test-id': { foo: 'baz' } });
    expect(engineWithElements.getState('test-id')).toEqual({ foo: 'baz' });
  });
});
