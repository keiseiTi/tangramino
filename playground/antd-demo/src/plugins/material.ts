import type { Plugin } from '@tangramino/base-editor';

export const materialPlugin = (): Plugin => ({
  id: 'material',
  editorContext: {
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        const methods = material.contextConfig?.methods || [];
        methods.unshift({
          name: 'init',
          description: '初始化',
        });
        material.contextConfig = {
          ...material.contextConfig,
          methods,
        };

        const attrPanel = material?.editorConfig?.panels?.find((panel) => panel.title === '属性');
        if (attrPanel) {
          attrPanel.configs?.unshift({
            label: '别名',
            field: 'alias',
            uiType: 'input',
          });
        }
      });
    },
  },
});
