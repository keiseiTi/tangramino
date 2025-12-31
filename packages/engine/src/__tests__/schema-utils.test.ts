import { describe, it, expect } from 'vitest';
import { SchemaUtils } from '../index';
import type { Schema } from '../interfaces/schema';

describe('SchemaUtils', () => {
  const initialSchema: Schema = {
    elements: {
      'root': { type: 'page', props: {} },
      'child1': { type: 'button', props: {} }
    },
    layout: {
      root: 'root',
      structure: {
        'root': ['child1']
      }
    },
    extensions: {}
  };

  it('should get parents correctly', () => {
    const parents = SchemaUtils.getParents(initialSchema, 'child1');
    expect(parents).toEqual(['root']);
  });

  it('should return empty parents for root', () => {
    const parents = SchemaUtils.getParents(initialSchema, 'root');
    expect(parents).toEqual([]);
  });

  it('should insert element correctly', () => {
    const newElement = {
      id: 'child2',
      type: 'text',
      props: { content: 'hello' }
    };

    const result = SchemaUtils.insertElement(initialSchema, 'root', newElement);

    expect(result.schema.elements['child2']).toBeDefined();
    expect(result.schema.layout.structure['root']).toContain('child2');
    expect(result.schema.layout.structure['root']).toHaveLength(2);
    expect(result.operation.elementId).toBe('child2');
    expect(result.operation.parentId).toBe('root');
    expect(result.operation.element.type).toBe('text');
  });

  it('should remove element correctly', () => {
    const result = SchemaUtils.removeElement(initialSchema, 'child1');

    expect(result.schema.elements['child1']).toBeUndefined();
    expect(result.schema.layout.structure['root']).not.toContain('child1');
    expect(result.operation.elementId).toBe('child1');
    expect(result.operation.element.type).toBe('button');
  });
});
