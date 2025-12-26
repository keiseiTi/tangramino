# 插件开发指南

Tangramino 提供了强大的插件系统，允许开发者通过插件机制扩展编辑器的功能。插件可以介入编辑器的生命周期、修改 Schema、转换物料、拦截操作等。

> 完整的插件 API 参考请查看 [插件系统 API](/api/plugin)

## 快速入门

### 使用 definePlugin 创建插件

推荐使用 `definePlugin` 工厂函数创建类型安全的插件：

```typescript
import { definePlugin } from '@tangramino/base-editor';

const myPlugin = definePlugin(() => ({
  id: 'my-plugin',

  onInit(ctx) {
    console.log('插件初始化');
    // 返回清理函数（可选）
    return () => console.log('插件清理');
  },

  onDispose(ctx) {
    console.log('插件销毁');
  },
}));
```

### 带配置的插件

```typescript
interface MyPluginOptions {
  debug?: boolean;
  maxItems?: number;
}

const configPlugin = definePlugin<EditorPlugin, MyPluginOptions>((options) => ({
  id: 'config-plugin',

  onInit(ctx) {
    if (options.debug) {
      console.log('Debug mode enabled');
    }
  },
}));

// 使用
const plugins = [configPlugin({ debug: true, maxItems: 10 })];
```

## 插件接口

插件是一个符合 `EditorPlugin` 接口的对象：

```typescript
interface EditorPlugin {
  // 元数据
  id: string; // 唯一标识
  dependencies?: string[]; // 依赖的插件
  priority?: number; // 优先级（越小越先执行）

  // 生命周期
  onInit?: (ctx: PluginContext) => (() => void) | void;
  onDispose?: (ctx: PluginContext) => void;

  // 物料转换
  transformMaterials?: (materials: Material[]) => Material[];

  // Schema 操作钩子
  onBeforeInsert?: (schema, targetId, element) => boolean | void;
  onAfterInsert?: (schema, insertedId) => void;
  onBeforeMove?: (schema, sourceId, targetId) => boolean | void;
  onAfterMove?: (schema, movedId) => void;
  onBeforeRemove?: (schema, targetId) => boolean | void;
  onAfterRemove?: (schema, removedId) => void;
  onBeforeUpdateProps?: (schema, targetId, props) => boolean | void;
  onAfterUpdateProps?: (schema, targetId) => void;

  // 编辑器钩子
  onElementActivate?: (element, parentChain) => void;
  onElementDeactivate?: (element) => void;
  onCanvasUpdated?: (ctx) => void;
}
```

## 插件上下文

插件通过 `PluginContext` 访问编辑器能力：

```typescript
interface PluginContext {
  engine: Engine; // 引擎实例
  getSchema: () => Schema; // 获取当前 Schema
  setSchema: (schema: Schema) => void; // 更新 Schema
  getMaterials: () => Material[]; // 获取物料列表
  getPlugin: <T>(id: string) => T | undefined; // 获取其他插件
}
```

## 实战示例

### 示例 1：表单插件

为表单内的组件自动包裹 `Form.Item`：

```typescript
import { definePlugin, useEditorCore } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Form } from 'antd';

const FormItem = Form.Item;

// 高阶组件：自动包裹 Form.Item
const withForm = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { label, name, required, tooltip } = props;
    const elementId = props['data-element-id'];
    const { schema } = useEditorCore();

    const isInForm = useMemo(() => {
      const parents = SchemaUtils.getParents(schema, elementId);
      const parentId = parents[0];
      return schema.elements[parentId]?.type === 'form';
    }, [schema, elementId]);

    if (isInForm) {
      return (
        <FormItem label={label} name={name} required={required} tooltip={tooltip}>
          <Component {...props} />
        </FormItem>
      );
    }
    return <Component {...props} />;
  };
};

export const formPlugin = definePlugin(() => ({
  id: 'form',

  transformMaterials(materials) {
    return materials.map(material => ({
      ...material,
      Component: withForm(material.Component),
    }));
  },

  onElementActivate(element, parentElements) {
    // 当元素在表单中时，动态添加表单项配置
    const isInForm = parentElements.some(p => p.type === 'form');
    if (isInForm) {
      // 动态注入表单配置面板...
    }
  },
}));
```

### 示例 2：物料增强插件

为所有物料自动添加通用属性：

```typescript
import { definePlugin } from '@tangramino/base-editor';

export const materialPlugin = definePlugin(() => ({
  id: 'material',

  transformMaterials(materials) {
    return materials.map((material) => {
      // 注入默认方法
      const methods = material.contextConfig?.methods || [];
      methods.unshift({ name: 'init', description: '初始化' });

      // 注入通用属性配置
      const panels = material.editorConfig?.panels || [];
      const attrPanel = panels.find((p) => p.title === '属性');
      if (attrPanel?.configs) {
        attrPanel.configs.unshift({
          label: '别名',
          field: 'alias',
          required: true,
          uiType: 'input',
        });
      }

      return {
        ...material,
        contextConfig: { ...material.contextConfig, methods },
      };
    });
  },
}));
```

### 示例 3：验证插件

拦截操作并进行验证：

```typescript
export const validationPlugin = definePlugin(() => ({
  id: 'validation',

  onBeforeRemove(schema, targetId) {
    // 禁止删除根元素
    if (targetId === schema.layout.root) {
      console.warn('不能删除根元素');
      return false;
    }
    return true;
  },

  onBeforeInsert(schema, targetId, element) {
    // 限制嵌套层级
    const parents = SchemaUtils.getParents(schema, targetId);
    if (parents.length >= 10) {
      console.warn('嵌套层级不能超过 10 层');
      return false;
    }
    return true;
  },
}));
```

## 内置插件

### historyPlugin - 历史记录

提供撤销/重做功能：

```typescript
import { historyPlugin, type HistoryPlugin } from '@tangramino/base-editor';

const plugins = [historyPlugin({ limit: 50 })];

// 在组件中使用
const history = ctx.getPlugin<HistoryPlugin>('history');
history?.undo();
history?.redo();
```

### modePlugin - 模式切换

设置编辑/渲染模式：

```typescript
import { modePlugin } from '@tangramino/base-editor';

const plugins = [modePlugin('edit')]; // 或 'render'
```

## 使用插件

在 `EditorProvider` 中注册：

```tsx
import { EditorProvider } from '@tangramino/base-editor';
import {
  formPlugin,
  materialPlugin,
  validationPlugin,
  historyPlugin,
} from './plugins';

const Editor = () => (
  <EditorProvider
    materials={materials}
    schema={schema}
    plugins={[
      historyPlugin(),
      formPlugin(),
      materialPlugin(),
      validationPlugin(),
    ]}
  >
    {/* 编辑器内容 */}
  </EditorProvider>
);
```

## 下一步

- 查看完整的 [插件 API 参考](/api/plugin)
- 了解 [内置插件的详细用法](/api/plugin#内置插件)
- 学习如何 [创建自定义插件](/api/plugin#创建自定义插件)
