import type { Plugin } from '../interface/plugin';

export const materialPlugin = (): Plugin => ({
  id: 'material',
  editorContext: {
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        const methods = material.contextConfig?.methods || [];
        methods.unshift({
          name: 'initialization',
          description: '初始化',
        });
        material.contextConfig = {
          ...material.contextConfig,
          methods,
        }
      });
    },
  },
});
