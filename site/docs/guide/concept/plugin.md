# 插件系统

Tangramino 提供了基于钩子（Hooks）的插件系统，允许开发者介入编辑器的生命周期、Schema 操作以及物料处理过程。

## 核心概念

使用 `definePlugin` 工具函数可以创建一个类型安全的插件。

```typescript
import { definePlugin } from '@tangramino/base-editor';

const myPlugin = definePlugin(() => ({
  id: 'my-plugin',
  // ... 钩子实现
}));
```

## 插件接口 (EditorPlugin)

插件接口主要包含以下几类钩子：

### 1. 生命周期 (Lifecycle)

- **`onInit(ctx: PluginContext)`**: 编辑器初始化时调用。可用于初始化状态，返回一个清理函数（cleanup）。
- **`onDispose(ctx: PluginContext)`**: 编辑器销毁时调用。

### 2. 物料转换 (MaterialHooks)

- **`transformMaterials(materials: Material[])`**: 在物料注册前对其进行转换。常用于批量为物料添加默认配置、包裹高阶组件（HOC）或注入通用属性。

### 3. Schema 操作拦截 (SchemaHooks)

在 Schema 发生变更前（Before）或变更后（After）触发。

- **`onBeforeInsert` / `onAfterInsert`**: 元素插入。
- **`onBeforeRemove` / `onAfterRemove`**: 元素删除。
- **`onBeforeMove` / `onAfterMove`**: 元素移动。
- **`onBeforeUpdateProps` / `onAfterUpdateProps`**: 属性更新。

> **注意**: `onBefore...` 钩子如果返回 `false`，则会阻止该操作的执行。

### 4. 编辑器交互 (EditorHooks)

- **`onElementActivate`**: 元素被选中/激活时触发。
- **`onElementDeactivate`**: 元素取消选中时触发。
- **`onCanvasUpdated`**: 画布重新渲染或 Schema 变更后触发。

## 示例：自动添加别名插件

此插件演示了如何使用 `transformMaterials` 为所有物料添加一个必填的“别名”属性配置。

```typescript
import { definePlugin, type EditorPlugin } from '@tangramino/base-editor';

export const aliasPlugin = definePlugin<EditorPlugin>(() => ({
  id: 'alias-plugin',

  transformMaterials: (materials) => {
    return materials.map((material) => {
      // 深度复制并修改 editorConfig
      const panels = material.editorConfig?.panels?.map((panel) => {
        if (panel.title === '属性') {
          return {
            ...panel,
            configs: [
              { label: '别名', field: 'alias', uiType: 'input', required: true },
              ...(panel.configs || []),
            ],
          };
        }
        return panel;
      }) || [];

      return {
        ...material,
        editorConfig: {
          ...material.editorConfig,
          panels,
        },
      };
    });
  },
}));
```

## 示例：删除保护插件

此插件演示了如何使用 `onBeforeRemove` 拦截删除操作，防止根节点被删除。

```typescript
export const protectRootPlugin = definePlugin(() => ({
  id: 'protect-root',
  
  onBeforeRemove(schema, targetId) {
    if (targetId === schema.layout.root) {
      console.warn('根节点不允许删除');
      return false; // 阻止删除
    }
  }
}));
```