import type { Schema } from '@tangramino/engine';

type InsertElement = {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  hidden?: boolean;
};

export interface Plugin {
  id: string;
  transformSchema?: {
    beforeInsertElement?: (
      schema: Schema,
      targetId: string,
      insertElement: InsertElement,
    ) => void;
    afterInsertElement?: (nextSchema: Schema) => void;
    beforeMoveElement?: (schema: Schema, sourceId: string, targetId: string) => void;
    afterMoveElement?: (nextSchema: Schema) => void;
    beforeRemoveElement?: (schema: Schema, targetId: string) => void;
    afterRemoveElement?: (nextSchema: Schema) => void;
  }
}
