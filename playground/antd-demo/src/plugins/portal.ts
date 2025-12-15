import { isPortal } from '@/utils';
import type { Plugin } from '@tangramino/base-editor';
import type { Element } from '@tangramino/engine';

export const portalPlugin = (): Plugin => {
  let portalElement: Element | null = null;
  return {
    id: 'portal',
    editorContext: {
      afterInsertMaterial(sourceElement) {
        if (isPortal(sourceElement.type)) {
          portalElement = sourceElement;
        }
      },
      afterCanvasUpdated: (engine) => {
        if (portalElement) {
          engine.setState({
            [portalElement.id]: {
              ...portalElement.props,
              open: true,
              getContainer: false,
            },
          });
          portalElement = null;
        }
      },
    },
  };
};
