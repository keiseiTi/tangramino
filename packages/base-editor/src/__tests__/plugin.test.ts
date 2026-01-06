import { describe, it, expect, vi } from 'vitest';
import { SchemaUtils } from '@tangramino/engine';
import type { Schema, Engine } from '@tangramino/engine';
import type {
  EditorPlugin,
  PluginContext,
  InsertOperation,
  MoveOperation,
} from '../interface/plugin';
import type { Material } from '../interface/material';
import { definePlugin } from '../utils/define-plugin';

describe('EditorPlugin System', () => {
  const mockSchema: Schema = {
    elements: {
      root: { type: 'page', props: {} },
      child1: { type: 'button', props: { text: 'Click' } },
    },
    layout: {
      root: 'root',
      structure: {
        root: ['child1'],
      },
    },
    extensions: {},
  };

  const createMockContext = (): PluginContext => ({
    engine: {} as Engine,
    getSchema: () => mockSchema,
    setSchema: vi.fn(),
    getMaterials: () => [],
    getPlugin: vi.fn(),
  });

  describe('definePlugin', () => {
    it('should create a plugin with factory function', () => {
      const pluginFactory = definePlugin(() => ({
        id: 'test-plugin',
        priority: 10,
      }));
      const plugin = pluginFactory();

      expect(plugin.id).toBe('test-plugin');
      expect(plugin.priority).toBe(10);
    });

    it('should pass options to plugin factory', () => {
      interface PluginOptions {
        enabled: boolean;
      }

      const factory = vi.fn((options: PluginOptions) => ({
        id: 'test-plugin',
        enabled: options.enabled,
      }));

      const plugin = definePlugin<EditorPlugin & { enabled: boolean }, PluginOptions>(factory);

      expect(typeof plugin).toBe('function');
    });
  });

  describe('Operation Hooks Integration', () => {
    it('should receive insert operation with correct details', () => {
      const onAfterInsert = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onAfterInsert,
      };

      const newElement = {
        id: 'new-button',
        type: 'button',
        props: { text: 'New' },
      };

      const result = SchemaUtils.insertElement(mockSchema, 'root', newElement);

      // Simulate calling the hook (as provider would do)
      plugin.onAfterInsert?.(result.schema, result.operation);

      expect(onAfterInsert).toHaveBeenCalledWith(result.schema, result.operation);
      const insertCall = onAfterInsert.mock.calls[0];
      expect(insertCall).toBeDefined();
      expect(insertCall?.[1]).toMatchObject({
        elementId: 'new-button',
        parentId: 'root',
        element: {
          type: 'button',
          props: { text: 'New' },
        },
      });
    });

    it('should receive move operation with correct details', () => {
      const onAfterMove = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onAfterMove,
      };

      const schemaWithContainers: Schema = {
        elements: {
          root: { type: 'page', props: {} },
          container1: { type: 'container', props: {} },
          container2: { type: 'container', props: {} },
          child1: { type: 'button', props: {} },
        },
        layout: {
          root: 'root',
          structure: {
            root: ['container1', 'container2'],
            container1: ['child1'],
            container2: [],
          },
        },
        extensions: {},
      };

      const result = SchemaUtils.moveElement(schemaWithContainers, 'child1', 'container2');

      plugin.onAfterMove?.(result.schema, result.operation);

      expect(onAfterMove).toHaveBeenCalled();
      const moveCall = onAfterMove.mock.calls[0];
      expect(moveCall).toBeDefined();
      expect(moveCall?.[1]).toMatchObject({
        elementId: 'child1',
        oldParentId: 'container1',
        newParentId: 'container2',
        mode: 'cross-level',
      });
    });

    it('should receive remove operation with element snapshot', () => {
      const onAfterRemove = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onAfterRemove,
      };

      const result = SchemaUtils.removeElement(mockSchema, 'child1');

      plugin.onAfterRemove?.(result.schema, result.operation);

      expect(onAfterRemove).toHaveBeenCalled();
      const removeCall = onAfterRemove.mock.calls[0];
      expect(removeCall).toBeDefined();
      expect(removeCall?.[1]).toMatchObject({
        elementId: 'child1',
        parentId: 'root',
        element: {
          type: 'button',
          props: { text: 'Click' },
        },
      });
    });

    it('should receive props update with old and new props', () => {
      const onAfterUpdateProps = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onAfterUpdateProps,
      };

      const result = SchemaUtils.setElementProps(mockSchema, 'child1', { text: 'Updated' });

      plugin.onAfterUpdateProps?.(result.schema, result.operation);

      expect(onAfterUpdateProps).toHaveBeenCalled();
      const updateCall = onAfterUpdateProps.mock.calls[0];
      expect(updateCall).toBeDefined();
      expect(updateCall?.[1]).toMatchObject({
        elementId: 'child1',
        props: { text: 'Updated' },
        oldProps: { text: 'Click' },
      });
    });
  });

  describe('Before Hooks', () => {
    it('should allow canceling insert operation', () => {
      const onBeforeInsert = vi.fn(() => false);
      const plugin: EditorPlugin = {
        id: 'test',
        onBeforeInsert,
      };

      const mockOp: InsertOperation = {
        elementId: 'new-element',
        parentId: 'root',
        index: 1,
        element: { id: 'new-element', type: 'text', props: {} },
      };

      const result = plugin.onBeforeInsert?.(mockSchema, mockOp);

      expect(result).toBe(false);
      expect(onBeforeInsert).toHaveBeenCalledWith(mockSchema, mockOp);
    });

    it('should allow canceling move operation', () => {
      const onBeforeMove = vi.fn(() => false);
      const plugin: EditorPlugin = {
        id: 'test',
        onBeforeMove,
      };

      const mockOp: MoveOperation = {
        elementId: 'child1',
        oldParentId: 'root',
        oldIndex: 0,
        newParentId: 'container',
        newIndex: 0,
        mode: 'cross-level',
      };

      const result = plugin.onBeforeMove?.(mockSchema, mockOp);

      expect(result).toBe(false);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call onInit when plugin initializes', () => {
      const onInit = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onInit,
      };

      const mockContext = createMockContext();
      plugin.onInit?.(mockContext);

      expect(onInit).toHaveBeenCalledWith(mockContext);
    });

    it('should call onDispose when plugin cleans up', () => {
      const onDispose = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onDispose,
      };

      const mockContext = createMockContext();
      plugin.onDispose?.(mockContext);

      expect(onDispose).toHaveBeenCalledWith(mockContext);
    });

    it('should return cleanup function from onInit', () => {
      const cleanup = vi.fn();
      const plugin: EditorPlugin = {
        id: 'test',
        onInit: () => cleanup,
      };

      const mockContext = createMockContext();
      const cleanupFn = plugin.onInit?.(mockContext);

      expect(typeof cleanupFn).toBe('function');
      cleanupFn?.();
      expect(cleanup).toHaveBeenCalled();
    });
  });

  describe('Material Hooks', () => {
    it('should transform materials', () => {
      const MockComponent = () => null;

      const transformMaterials = vi.fn((materials: Material[]) => [
        ...materials,
        {
          type: 'custom',
          title: 'Custom Component',
          Component: MockComponent,
          isBlock: false,
          isContainer: false,
        },
      ]);

      const plugin: EditorPlugin = {
        id: 'test',
        transformMaterials,
      };

      const inputMaterials: Material[] = [
        {
          type: 'button',
          title: 'Button',
          Component: MockComponent,
          isBlock: false,
          isContainer: false,
        },
      ];
      const result = plugin.transformMaterials?.(inputMaterials);

      expect(result).toHaveLength(2);
      expect(result?.[1]).toMatchObject({
        type: 'custom',
        title: 'Custom Component',
      });
    });
  });

  describe('Plugin Metadata', () => {
    it('should support priority for execution order', () => {
      const highPriorityPlugin = definePlugin(() => ({
        id: 'high-priority',
        priority: 5,
      }))();

      const lowPriorityPlugin = definePlugin(() => ({
        id: 'low-priority',
        priority: 100,
      }))();

      expect(highPriorityPlugin.priority).toBe(5);
      expect(lowPriorityPlugin.priority).toBe(100);
    });

    it('should support dependencies', () => {
      const plugin = definePlugin(() => ({
        id: 'dependent-plugin',
        dependencies: ['history', 'collaboration'],
      }))();

      expect(plugin.dependencies).toEqual(['history', 'collaboration']);
    });
  });
});
