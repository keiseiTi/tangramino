import { definePlugin, type EditorPlugin, type PluginContext } from '@tangramino/base-editor';
import { isPortal } from '@/utils';
import type { Element } from '@tangramino/engine';

/**
 * Portal 插件 - 自动打开 Portal 类组件（如 Modal, Drawer 等）
 */
export const portalPlugin = definePlugin<EditorPlugin>(() => {
  let portalElement: (Element & { material: { type: string } }) | null = null;
  let ctx: PluginContext | null = null;

  return {
    id: 'portal',
    onInit(context) {
      ctx = context;
      return () => {
        portalElement = null;
        ctx = null;
      };
    },
    onAfterInsert(schema, operation) {
      const { elementId } = operation;
      const element = schema.elements[elementId];
      if (element && isPortal(element.type)) {
        portalElement = {
          id: elementId,
          type: element.type,
          props: element.props,
          material: { type: element.type },
        };
      }
    },
    onCanvasUpdated() {
      if (portalElement && ctx) {
        ctx.engine.setState({
          [portalElement.id]: {
            ...portalElement.props,
            open: true,
            getContainer: false,
          },
        });
        portalElement = null;
      }
    },
  };
});
