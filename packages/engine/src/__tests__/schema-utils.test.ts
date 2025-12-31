import { describe, it, expect } from 'vitest';
import { SchemaUtils } from '../index';
import type { Schema } from '../interfaces/schema';

describe('SchemaUtils', () => {
  const initialSchema: Schema = {
    elements: {
      'root': { type: 'page', props: {} },
      'child1': { type: 'button', props: { text: 'Click me' } }
    },
    layout: {
      root: 'root',
      structure: {
        'root': ['child1']
      }
    },
    extensions: {}
  };

  describe('getParents', () => {
    it('should get parents correctly', () => {
      const parents = SchemaUtils.getParents(initialSchema, 'child1');
      expect(parents).toEqual(['root']);
    });

    it('should return empty parents for root', () => {
      const parents = SchemaUtils.getParents(initialSchema, 'root');
      expect(parents).toEqual([]);
    });

    it('should handle nested elements', () => {
      const nestedSchema: Schema = {
        elements: {
          'root': { type: 'page', props: {} },
          'container1': { type: 'container', props: {} },
          'child1': { type: 'button', props: {} }
        },
        layout: {
          root: 'root',
          structure: {
            'root': ['container1'],
            'container1': ['child1']
          }
        },
        extensions: {}
      };

      const parents = SchemaUtils.getParents(nestedSchema, 'child1');
      expect(parents).toEqual(['container1', 'root']);
    });
  });

  describe('insertElement', () => {
    it('should insert element correctly with operation details', () => {
      const newElement = {
        id: 'child2',
        type: 'text',
        props: { content: 'hello' }
      };

      const result = SchemaUtils.insertElement(initialSchema, 'root', newElement);

      // Check schema updates
      expect(result.schema.elements['child2']).toBeDefined();
      expect(result.schema.elements['child2']?.type).toBe('text');
      expect(result.schema.elements['child2']?.props).toEqual({ content: 'hello' });
      expect(result.schema.layout.structure['root']).toContain('child2');
      expect(result.schema.layout.structure['root']).toHaveLength(2);

      // Check operation details
      expect(result.operation.elementId).toBe('child2');
      expect(result.operation.parentId).toBe('root');
      expect(result.operation.index).toBeGreaterThanOrEqual(0);
      expect(result.operation.element.type).toBe('text');
      expect(result.operation.element.props).toEqual({ content: 'hello' });
    });

    it('should handle hidden property', () => {
      const newElement = {
        id: 'hidden-child',
        type: 'text',
        props: {},
        hidden: true
      };

      const result = SchemaUtils.insertElement(initialSchema, 'root', newElement);

      expect(result.schema.elements['hidden-child']?.hidden).toBe(true);
      expect(result.operation.element.hidden).toBe(true);
    });
  });

  describe('removeElement', () => {
    it('should remove element correctly with operation details', () => {
      const result = SchemaUtils.removeElement(initialSchema, 'child1');

      // Check schema updates
      expect(result.schema.elements['child1']).toBeUndefined();
      expect(result.schema.layout.structure['root']).not.toContain('child1');
      expect(result.schema.layout.structure['root']).toHaveLength(0);

      // Check operation details
      expect(result.operation.elementId).toBe('child1');
      expect(result.operation.parentId).toBe('root');
      expect(result.operation.index).toBe(0);
      expect(result.operation.element.type).toBe('button');
      expect(result.operation.element.props).toEqual({ text: 'Click me' });
    });

    it('should remove element with children recursively', () => {
      const schemaWithChildren: Schema = {
        elements: {
          'root': { type: 'page', props: {} },
          'container1': { type: 'container', props: {} },
          'child1': { type: 'button', props: {} },
          'child2': { type: 'text', props: {} }
        },
        layout: {
          root: 'root',
          structure: {
            'root': ['container1'],
            'container1': ['child1', 'child2']
          }
        },
        extensions: {}
      };

      const result = SchemaUtils.removeElement(schemaWithChildren, 'container1');

      // Container and all children should be removed
      expect(result.schema.elements['container1']).toBeUndefined();
      expect(result.schema.elements['child1']).toBeUndefined();
      expect(result.schema.elements['child2']).toBeUndefined();
      expect(result.schema.layout.structure['container1']).toBeUndefined();
    });
  });

  describe('moveElement', () => {
    it('should move element to different parent using cross-level mode', () => {
      const schemaWithContainers: Schema = {
        elements: {
          'root': { type: 'page', props: {} },
          'container1': { type: 'container', props: {} },
          'container2': { type: 'container', props: {} },
          'child1': { type: 'button', props: {} }
        },
        layout: {
          root: 'root',
          structure: {
            'root': ['container1', 'container2'],
            'container1': ['child1'],
            'container2': []
          }
        },
        extensions: {}
      };

      const result = SchemaUtils.moveElement(schemaWithContainers, 'child1', 'container2');

      // Check schema updates
      expect(result.schema.layout.structure['container1']).toEqual([]);
      expect(result.schema.layout.structure['container2']).toEqual(['child1']);

      // Check operation details
      expect(result.operation.elementId).toBe('child1');
      expect(result.operation.oldParentId).toBe('container1');
      expect(result.operation.newParentId).toBe('container2');
      expect(result.operation.mode).toBe('cross-level');
    });

    it('should move element using same-level mode', () => {
      const schemaWithMultipleChildren: Schema = {
        elements: {
          'root': { type: 'page', props: {} },
          'child1': { type: 'button', props: {} },
          'child2': { type: 'text', props: {} },
          'child3': { type: 'input', props: {} }
        },
        layout: {
          root: 'root',
          structure: {
            'root': ['child1', 'child2', 'child3']
          }
        },
        extensions: {}
      };

      // Move child1 after child3
      const result = SchemaUtils.moveElement(
        schemaWithMultipleChildren,
        'child1',
        'child3',
        { mode: 'same-level', position: 'after' }
      );

      // child1 should now be after child3
      expect(result.schema.layout.structure['root']).toContain('child1');
      expect(result.operation.mode).toBe('same-level');
    });
  });

  describe('setElementProps', () => {
    it('should update element props with operation details', () => {
      const newProps = { text: 'Updated', size: 'large' };
      const result = SchemaUtils.setElementProps(initialSchema, 'child1', newProps);

      // Check schema updates
      expect(result.schema.elements['child1']?.props).toEqual(newProps);

      // Check operation details
      expect(result.operation.elementId).toBe('child1');
      expect(result.operation.props).toEqual(newProps);
      expect(result.operation.oldProps).toEqual({ text: 'Click me' });
    });

    it('should handle partial props update', () => {
      const schemaWithMultipleProps: Schema = {
        elements: {
          'root': { type: 'page', props: {} },
          'child1': { type: 'button', props: { text: 'Click', color: 'blue', size: 'medium' } }
        },
        layout: {
          root: 'root',
          structure: {
            'root': ['child1']
          }
        },
        extensions: {}
      };

      const result = SchemaUtils.setElementProps(schemaWithMultipleProps, 'child1', { text: 'Updated' });

      // setElementProps 会合并属性,不会删除未更新的属性
      expect(result.schema.elements['child1']?.props).toEqual({
        text: 'Updated',
        color: 'blue',
        size: 'medium'
      });
      expect(result.operation.props).toEqual({
        text: 'Updated',
        color: 'blue',
        size: 'medium'
      });
      expect(result.operation.oldProps).toEqual({ text: 'Click', color: 'blue', size: 'medium' });
    });
  });

  describe('insertAdjacentElement', () => {
    it('should insert element before target element', () => {
      const newElement = {
        id: 'child0',
        type: 'text',
        props: {}
      };

      const result = SchemaUtils.insertAdjacentElement(initialSchema, 'child1', newElement, 'before');

      expect(result.schema.layout.structure['root']).toContain('child0');
      expect(result.schema.layout.structure['root']).toContain('child1');
    });

    it('should insert element after target element', () => {
      const newElement = {
        id: 'child2',
        type: 'text',
        props: {}
      };

      const result = SchemaUtils.insertAdjacentElement(initialSchema, 'child1', newElement, 'after');

      expect(result.schema.layout.structure['root']).toContain('child1');
      expect(result.schema.layout.structure['root']).toContain('child2');
    });
  });
});
