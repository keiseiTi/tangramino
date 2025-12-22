import type { Plugin } from '@tangramino/base-editor';

export const materialPlugin = (): Plugin => ({
  id: 'material',
  editorContext: {
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        // 检查是否已经添加过 init 方法，避免重复添加
        const methods = material.contextConfig?.methods || [];
        const hasInitMethod = methods.some((method) => method.name === 'init');

        if (!hasInitMethod) {
          methods.unshift({
            name: 'init',
            description: '初始化',
          });
          material.contextConfig = {
            ...material.contextConfig,
            methods,
          };
        }

        const attrPanel = material?.editorConfig?.panels?.find((panel) => panel.title === '属性');
        if (attrPanel) {
          // 检查是否已经添加过 alias 字段，避免重复添加
          const hasAliasConfig = attrPanel.configs?.some((config) => config.field === 'alias');

          if (!hasAliasConfig) {
            attrPanel.configs?.unshift({
              label: '别名',
              field: 'alias',
              required: true,
              uiType: 'input',
            });
          }
        }
      });
    },
  },
});
