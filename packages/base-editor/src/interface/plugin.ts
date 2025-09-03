import type { Schema, InsertElement } from '@tangramino/engine';

export interface Plugin {
  id: string;
  transformSchema?: {
    beforeInsertElement?: (schema: Schema, targetId: string, insertElement: InsertElement) => void;
    afterInsertElement?: (nextSchema: Schema) => void;
    beforeMoveElement?: (schema: Schema, sourceId: string, targetId: string) => void;
    afterMoveElement?: (nextSchema: Schema) => void;
    beforeRemoveElement?: (schema: Schema, targetId: string) => void;
    afterRemoveElement?: (nextSchema: Schema) => void;
    beforeSetElementProps?: (
      schema: Schema,
      targetId: string,
      props: Record<string, unknown>,
    ) => void;
    afterSetElementProps?: (nextSchema: Schema) => void;
  };
}
