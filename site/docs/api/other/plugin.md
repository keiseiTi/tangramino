# Plugin System

`@tangramino/base-editor` 提供了一套完整的插件系统，用于扩展编辑器功能。

## definePlugin

创建类型安全的编辑态插件的工厂函数。

```typescript
import { definePlugin } from '@tangramino/base-editor';

// 无参数插件
const myPlugin = definePlugin(() => ({
  id: 'my-plugin',
  onInit(ctx) {
    console.log('Plugin initialized');
  },
}));

// 带参数插件
const configPlugin = definePlugin<EditorPlugin, { debug: boolean }>(
  (options) => ({
    id: 'config-plugin',
    onInit(ctx) {
      if (options.debug) console.log('Debug mode');
    },
  }),
);
```

## EditorPlugin 接口

编辑态插件的完整接口定义。

```typescript
interface EditorPlugin
  extends PluginMeta,
    PluginLifecycle,
    MaterialHooks,
    SchemaHooks,
    EditorHooks {}
```

### PluginMeta - 插件元数据

```typescript
interface PluginMeta {
  // 唯一标识
  id: string;
  // 依赖的其他插件 ID
  dependencies?: string[];
  // 优先级，数字越小越先执行，默认 100
  priority?: number;
}
```

### PluginLifecycle - 生命周期钩子

```typescript
interface PluginLifecycle {
  // 插件初始化，在 EditorProvider 挂载时调用
  // 可返回清理函数
  onInit?: (ctx: PluginContext) => (() => void) | void;

  // 插件销毁，在 EditorProvider 卸载时调用
  onDispose?: (ctx: PluginContext) => void;
}
```

### MaterialHooks - 物料转换钩子

```typescript
interface MaterialHooks {
  // 转换 materials，必须返回新数组
  // 用于添加默认配置、包装组件等
  transformMaterials?: (materials: Material[]) => Material[];
}
```

### SchemaHooks - Schema 操作钩子

Schema 操作钩子接收操作级别的详细信息，而不仅是最终的 schema 状态。这使得插件能够获取操作的具体细节（如元素 ID、父元素、索引等），实现增量同步等高级功能。

```typescript
// 插入操作详情
interface InsertOperation {
  elementId: string;
  parentId: string;
  index: number;
  element: { type: string; props: Record<string, unknown>; hidden?: boolean };
}

// 移动操作详情
interface MoveOperation {
  elementId: string;
  oldParentId: string;
  oldIndex: number;
  newParentId: string;
  newIndex: number;
  mode: 'same-level' | 'cross-level';
}

// 删除操作详情
interface RemoveOperation {
  elementId: string;
  parentId: string;
  index: number;
  element: Element; // 被删除元素的完整快照（包含子元素）
}

// 属性更新操作详情
interface UpdatePropsOperation {
  elementId: string;
  props: Record<string, unknown>; // 新属性
  oldProps: Record<string, unknown>; // 旧属性
}

interface SchemaHooks {
  // 插入前，返回 false 可取消操作
  onBeforeInsert?: (schema: Schema, operation: InsertOperation) => boolean | void;
  // 插入后
  onAfterInsert?: (schema: Schema, operation: InsertOperation) => void;

  // 移动前，返回 false 可取消操作
  onBeforeMove?: (schema: Schema, operation: MoveOperation) => boolean | void;
  // 移动后
  onAfterMove?: (schema: Schema, operation: MoveOperation) => void;

  // 删除前，返回 false 可取消操作
  onBeforeRemove?: (schema: Schema, operation: RemoveOperation) => boolean | void;
  // 删除后
  onAfterRemove?: (schema: Schema, operation: RemoveOperation) => void;

  // 属性更新前，返回 false 可取消操作
  onBeforeUpdateProps?: (schema: Schema, operation: UpdatePropsOperation) => boolean | void;
  // 属性更新后
  onAfterUpdateProps?: (schema: Schema, operation: UpdatePropsOperation) => void;
}
```

**使用示例**：

```typescript
const myPlugin = definePlugin(() => ({
  id: 'my-plugin',
  
  onAfterInsert(schema, operation) {
    console.log('元素已插入:', {
      elementId: operation.elementId,
      parentId: operation.parentId,
      index: operation.index,
      elementType: operation.element.type,
    });
  },
  
  onAfterMove(schema, operation) {
    console.log('元素已移动:', {
      elementId: operation.elementId,
      from: `${operation.oldParentId}[${operation.oldIndex}]`,
      to: `${operation.newParentId}[${operation.newIndex}]`,
    });
  },
  
  onAfterRemove(schema, operation) {
    console.log('元素已删除:', {
      elementId: operation.elementId,
      parentId: operation.parentId,
      removedElement: operation.element,
    });
  },
  
  onAfterUpdateProps(schema, operation) {
    console.log('属性已更新:', {
      elementId: operation.elementId,
      changedProps: operation.props,
      oldProps: operation.oldProps,
    });
  },
}));
```

### EditorHooks - 编辑器交互钩子

```typescript
interface EditorHooks {
  // 元素被激活/选中时
  onElementActivate?: (
    element: Element & { material: Material },
    parentChain: (Element & { material: Material })[],
  ) => void;

  // 元素取消激活时
  onElementDeactivate?: (element: Element) => void;

  // 画布更新完成时
  onCanvasUpdated?: (ctx: PluginContext) => void;
}
```

## PluginContext - 插件上下文

插件可以通过上下文访问编辑器能力。

```typescript
interface PluginContext {
  // 编辑器引擎实例
  engine: Engine;
  // 获取当前 schema
  getSchema: () => Schema;
  // 更新 schema
  setSchema: (schema: Schema) => void;
  // 获取 materials
  getMaterials: () => Material[];
  // 获取其他已加载的插件实例
  getPlugin: <T extends EditorPlugin>(id: string) => T | undefined;
}
```

## 内置插件

### historyPlugin - 历史记录插件

提供撤销/重做功能。

```typescript
import { historyPlugin, type HistoryPlugin } from '@tangramino/base-editor';

// 使用
const plugins = [
  historyPlugin({ limit: 50 })
];

// 在组件中使用
function ToolBar() {
  const { getPlugin } = usePluginCore();
  const history = getPlugin<HistoryPlugin>('history');

  return (
    <div>
      <button
        onClick={() => history?.undo()}
        disabled={!history?.canUndo()}
      >
        撤销
      </button>
      <button
        onClick={() => history?.redo()}
        disabled={!history?.canRedo()}
      >
        重做
      </button>
    </div>
  );
}
```

#### 配置选项

| 选项  | 类型     | 默认值 | 说明             |
| ----- | -------- | ------ | ---------------- |
| limit | `number` | 100    | 历史记录最大数量 |

#### 扩展方法

| 方法    | 类型            | 说明         |
| ------- | --------------- | ------------ |
| undo    | `() => void`    | 撤销操作     |
| redo    | `() => void`    | 重做操作     |
| canUndo | `() => boolean` | 是否可以撤销 |
| canRedo | `() => boolean` | 是否可以重做 |
| clear   | `() => void`    | 清空历史记录 |

### modePlugin - 模式插件

设置所有元素的编辑/渲染模式。

```typescript
import { modePlugin } from '@tangramino/base-editor';

// 编辑模式
const plugins = [modePlugin('edit')];

// 渲染模式
const plugins = [modePlugin('render')];
```

#### 参数

| 参数 | 类型                 | 说明     |
| ---- | -------------------- | -------- |
| mode | `'edit' \| 'render'` | 模式类型 |

## 创建自定义插件

### 基础插件

```typescript
import { definePlugin } from '@tangramino/base-editor';

const logPlugin = definePlugin(() => ({
  id: 'log-plugin',
  priority: 10,

  onInit(ctx) {
    console.log('Editor initialized');

    // 返回清理函数
    return () => {
      console.log('Cleanup');
    };
  },

  onDispose(ctx) {
    console.log('Editor disposed');
  },

  onAfterInsert(schema, insertedId) {
    console.log('Element inserted:', insertedId);
  },

  onCanvasUpdated(ctx) {
    console.log('Canvas updated');
  },
}));
```

### 带状态的插件

```typescript
const counterPlugin = definePlugin(() => {
  // 插件内部状态
  let insertCount = 0;
  let removeCount = 0;

  return {
    id: 'counter-plugin',

    onAfterInsert() {
      insertCount++;
      console.log('Total inserts:', insertCount);
    },

    onAfterRemove() {
      removeCount++;
      console.log('Total removes:', removeCount);
    },

    // 对外暴露方法
    getStats: () => ({ insertCount, removeCount }),
  };
});
```

### 依赖其他插件

```typescript
const dependentPlugin = definePlugin(() => ({
  id: 'dependent-plugin',
  dependencies: ['history'],

  onInit(ctx) {
    // 获取依赖的插件
    const history = ctx.getPlugin<HistoryPlugin>('history');

    if (history) {
      // 使用 history 插件的功能
    }
  },
}));
```

### 转换物料

```typescript
const materialEnhancePlugin = definePlugin(() => ({
  id: 'material-enhance',

  transformMaterials(materials) {
    return materials.map((material) => ({
      ...material,
      // 为所有物料添加默认的 className
      defaultProps: {
        ...material.defaultProps,
        className: `tg-${material.type.toLowerCase()}`,
      },
    }));
  },
}));
```

### 拦截操作

```typescript
const validationPlugin = definePlugin(() => ({
  id: 'validation-plugin',

  // 拦截插入操作
  onBeforeInsert(schema, targetId, element) {
    // 禁止在特定容器中添加元素
    if (targetId === 'locked-container') {
      console.warn('Cannot insert into locked container');
      return false;
    }
    return true;
  },

  // 拦截删除操作
  onBeforeRemove(schema, targetId) {
    // 禁止删除根元素
    if (targetId === schema.layout.root) {
      console.warn('Cannot remove root element');
      return false;
    }
    return true;
  },

  // 拦截属性更新
  onBeforeUpdateProps(schema, targetId, props) {
    // 验证属性值
    if (props.width && typeof props.width !== 'number') {
      console.warn('Width must be a number');
      return false;
    }
    return true;
  },
}));
```

## 插件注册顺序

插件按以下规则排序执行：

1. **依赖关系**: 被依赖的插件先执行
2. **优先级**: `priority` 值小的先执行（默认 100）
3. **注册顺序**: 同优先级按注册顺序执行

```typescript
const plugins = [
  pluginA(), // priority: 100
  pluginB(), // priority: 50, 先于 A 执行
  pluginC(), // priority: 100, dependencies: ['pluginB'], 在 B 之后执行
];
```

## 完整示例

```typescript
import {
  definePlugin,
  type EditorPlugin,
  type HistoryPlugin,
} from '@tangramino/base-editor';
import type { Schema } from '@tangramino/engine';

interface AutoSaveOptions {
  interval?: number;
  onSave?: (schema: Schema) => Promise<void>;
}

type AutoSavePlugin = EditorPlugin & {
  save: () => Promise<void>;
  setEnabled: (enabled: boolean) => void;
};

export const autoSavePlugin = definePlugin<AutoSavePlugin, AutoSaveOptions>(
  (options) => {
    const { interval = 30000, onSave } = options;

    let enabled = true;
    let timer: number | null = null;
    let ctx: PluginContext | null = null;

    const save = async () => {
      if (!ctx || !onSave) return;
      try {
        await onSave(ctx.getSchema());
        console.log('Auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    const startTimer = () => {
      if (timer) clearInterval(timer);
      if (enabled) {
        timer = window.setInterval(save, interval);
      }
    };

    return {
      id: 'auto-save',
      priority: 200, // 较低优先级，在其他插件之后执行

      onInit(_ctx) {
        ctx = _ctx;
        startTimer();

        return () => {
          if (timer) clearInterval(timer);
        };
      },

      onDispose() {
        if (timer) clearInterval(timer);
        ctx = null;
      },

      // 任何修改后触发保存
      onAfterInsert() {
        if (enabled) save();
      },

      onAfterMove() {
        if (enabled) save();
      },

      onAfterRemove() {
        if (enabled) save();
      },

      onAfterUpdateProps() {
        if (enabled) save();
      },

      // 对外暴露的方法
      save,
      setEnabled(value: boolean) {
        enabled = value;
        startTimer();
      },
    };
  },
);

// 使用
const plugins = [
  historyPlugin(),
  autoSavePlugin({
    interval: 60000,
    onSave: async (schema) => {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(schema),
      });
    },
  }),
];
```
