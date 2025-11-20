import type { Schema, InsertElement } from '@tangramino/engine';
import type { Material } from './material';

/**
 * Plugin interface for extending editor functionality
 * Plugins can hook into schema transformations and editor context initialization
 */
export interface Plugin {
  /** Unique identifier for the plugin */
  id: string;
  /**
   * Schema transformation hooks
   * These hooks are called before and after schema operations
   */
  transformSchema?: {
    /**
     * Called before inserting a new element into the schema
     * @param schema - Current schema
     * @param targetId - ID of the target element where insertion will occur
     * @param insertElement - The element to be inserted
     */
    beforeInsertElement?: (schema: Schema, targetId: string, insertElement: InsertElement) => void;
    /**
     * Called after an element has been inserted
     * @param nextSchema - The updated schema after insertion
     */
    afterInsertElement?: (nextSchema: Schema) => void;
    /**
     * Called before moving an element in the schema
     * @param schema - Current schema
     * @param sourceId - ID of the element being moved
     * @param targetId - ID of the target location
     */
    beforeMoveElement?: (schema: Schema, sourceId: string, targetId: string) => void;
    /**
     * Called after an element has been moved
     * @param nextSchema - The updated schema after moving
     */
    afterMoveElement?: (nextSchema: Schema) => void;
    /**
     * Called before removing an element from the schema
     * @param schema - Current schema
     * @param targetId - ID of the element to be removed
     */
    beforeRemoveElement?: (schema: Schema, targetId: string) => void;
    /**
     * Called after an element has been removed
     * @param nextSchema - The updated schema after removal
     */
    afterRemoveElement?: (nextSchema: Schema) => void;
    /**
     * Called before setting element properties
     * @param schema - Current schema
     * @param targetId - ID of the element whose props will be updated
     * @param props - New properties to be set
     */
    beforeSetElementProps?: (
      schema: Schema,
      targetId: string,
      props: Record<string, unknown>,
    ) => void;
    /**
     * Called after element properties have been set
     * @param nextSchema - The updated schema after setting props
     */
    afterSetElementProps?: (nextSchema: Schema) => void;
  };
  /**
   * Editor context hooks
   * These hooks are called during editor initialization
   */
  editorContext?: {
    /**
     * Called before materials are initialized in the editor
     * Can be used to modify or validate materials before they are registered
     * @param materials - Array of materials to be initialized
     */
    beforeInitMaterials?: (materials: Material[]) => void;
  };
}
