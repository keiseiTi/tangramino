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

    const newSchema = SchemaUtils.insertElement(initialSchema, 'root', newElement);

    expect(newSchema.elements['child2']).toBeDefined();
    expect(newSchema.layout.structure['root']).toContain('child2');
    expect(newSchema.layout.structure['root']).toHaveLength(2);
  });

  it('should remove element correctly', () => {
    const newSchema = SchemaUtils.removeElement(initialSchema, 'child1');

    expect(newSchema.elements['child1']).toBeUndefined();
    expect(newSchema.layout.structure['root']).not.toContain('child1');
  });
});
