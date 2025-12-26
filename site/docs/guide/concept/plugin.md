# 插件系统

Tangramino 提供基于钩子（Hooks）的插件系统，允许开发者介入编辑器的生命周期、Schema 操作以及物料处理过程。

## 快速开始

使用 `definePlugin` 创建类型安全的插件：

```typescript
import { definePlugin } from '@tangramino/base-editor';

const myPlugin = definePlugin(() => ({
  id: 'my-plugin',
  // 钩子实现...
}));
```

## 钩子一览

| 类别 | 钩子 | 描述 |
|------|------|------|
| **生命周期** | `onInit` | 编辑器初始化时调用 |
| | `onDispose` | 编辑器销毁时调用 |
| **物料转换** | `transformMaterials` | 批量转换/增强物料 |
| **Schema 操作** | `onBeforeInsert` / `onAfterInsert` | 元素插入前后 |
| | `onBeforeRemove` / `onAfterRemove` | 元素删除前后 |
| | `onBeforeMove` / `onAfterMove` | 元素移动前后 |
| | `onBeforeUpdateProps` / `onAfterUpdateProps` | 属性更新前后 |
| **编辑器交互** | `onElementActivate` | 元素被选中时 |
| | `onElementDeactivate` | 元素取消选中时 |
| | `onCanvasUpdated` | 画布更新后 |

> **注意**: `onBefore...` 钩子返回 `false` 可阻止操作执行。

## 生命周期钩子

```typescript
definePlugin(() => ({
  id: 'lifecycle-demo',
  
  onInit(ctx) {
    console.log('编辑器初始化');
    // 返回清理函数
    return () => {
      console.log('清理资源');
    };
  },
  
  onDispose(ctx) {
    console.log('编辑器销毁');
  }
}));
```

## 物料转换

批量为所有物料添加默认配置、包裹 HOC 或注入通用属性：

```typescript
// 为所有物料添加"别名"配置项
const aliasPlugin = definePlugin(() => ({
  id: 'alias-plugin',

  transformMaterials: (materials) => {
    return materials.map((material) => ({
      ...material,
      editorConfig: {
        ...material.editorConfig,
        panels: material.editorConfig?.panels?.map((panel) => {
          if (panel.title === '属性') {
            return {
              ...panel,
              configs: [
                { 
                  label: '别名', 
                  field: 'alias', 
                  uiType: 'input', 
                  required: true 
                },
                ...(panel.configs || []),
              ],
            };
          }
          return panel;
        }) || [],
      },
    }));
  },
}));
```

## Schema 操作拦截

### 阻止删除根节点

```typescript
const protectRootPlugin = definePlugin(() => ({
  id: 'protect-root',
  
  onBeforeRemove(schema, targetId) {
    if (targetId === schema.layout.root) {
      console.warn('根节点不允许删除');
      return false; // 阻止删除
    }
  }
}));
```

### 自动生成 ID

```typescript
const autoIdPlugin = definePlugin(() => ({
  id: 'auto-id',
  
  onBeforeInsert(schema, element, targetId, position) {
    // 修改元素属性
    element.props = {
      ...element.props,
      'data-id': `${element.type}-${Date.now()}`
    };
    // 返回 true 或 undefined 继续执行
  },
  
  onAfterInsert(schema, elementId, targetId) {
    console.log(`插入成功: ${elementId}`);
  }
}));
```

### 属性变更追踪

```typescript
const trackChangesPlugin = definePlugin(() => ({
  id: 'track-changes',
  
  onAfterUpdateProps(schema, elementId, newProps) {
    console.log(`属性更新: ${elementId}`, newProps);
    // 可用于撤销/重做、状态同步等
  }
}));
```

## 编辑器交互钩子

```typescript
const interactionPlugin = definePlugin(() => ({
  id: 'interaction',
  
  onElementActivate(elementId, element) {
    console.log('选中元素:', elementId);
    // 可用于显示属性面板、更新工具栏状态等
  },
  
  onElementDeactivate(elementId) {
    console.log('取消选中:', elementId);
  },
  
  onCanvasUpdated(schema) {
    console.log('画布已更新');
    // 可用于自动保存、预览刷新等
  }
}));
```

## 插件上下文

钩子函数接收 `PluginContext`，提供编辑器核心能力：

```typescript
interface PluginContext {
  schema: Schema;           // 当前 Schema
  materials: Material[];    // 已注册物料
  activeElement?: string;   // 当前选中元素 ID
  // ... 更多能力
}
```

## 使用插件

在编辑器中注册插件：

```tsx
import { BaseEditor } from '@tangramino/base-editor';

<BaseEditor
  plugins={[
    protectRootPlugin(),
    aliasPlugin(),
    trackChangesPlugin()
  ]}
  // ...
/>
```

## 最佳实践

1. **唯一 ID**：确保每个插件有唯一的 `id`
2. **职责单一**：每个插件专注解决一个问题
3. **清理资源**：在 `onInit` 中返回清理函数
4. **避免阻塞**：`onBefore...` 钩子中避免耗时操作
5. **错误处理**：钩子中添加适当的错误处理逻辑
