# @tangramino/engine

Tangramino 的核心引擎，负责 Schema 定义、数据管理和事件处理。它是一个框架无关的库，可以作为构建各种可视化编辑器的基础。

## ✨ 特性

- **Schema 驱动**：定义了一套标准的 JSONSchema 规范来描述页面结构。
- **框架无关**：纯 TypeScript 编写，不依赖任何 UI 框架。
- **可扩展**：提供灵活的插件机制。

## 📦 安装

```bash
npm install @tangramino/engine
# 或者
yarn add @tangramino/engine
```

## 📖 核心概念

### Schema 结构

Tangramino 使用 JSONSchema 描述页面。一个典型的 Schema 结构如下：

```typescript
export interface Schema {
  /** 页面元数据 */
  meta?: Record<string, unknown>;
  /** 元素集合 (扁平化存储) */
  elements: Record<string, Element>;
  /** 布局树 */
  layout: {
    /** 根节点 ID */
    root: string;
    /** 父子关系映射: parentId -> childIds[] */
    structure: Record<string, string[]>;
  };
  /** 扩展数据 */
  extensions?: Record<string, unknown>;
}

export interface Element {
  /** 元素唯一 ID */
  id: string;
  /** 元素类型 (对应注册的物料) */
  type: string;
  /** 元素属性 */
  props: Record<string, unknown>;
  /** 样式 */
  style?: Record<string, unknown>;
  /** 类名 */
  className?: string;
}
```

### SchemaUtils

提供了丰富的工具函数来操作 Schema：

- `insertElement`: 插入元素
- `removeElement`: 删除元素
- `moveElement`: 移动元素
- `setElementProps`: 设置属性
- `getParents`: 获取父级链

## 🔨 使用

通常你不需要直接使用 Engine，而是配合 `@tangramino/react` 或 `@tangramino/base-editor` 使用。

如果你想单独使用 Engine 的能力：

```typescript
import { SchemaUtils } from '@tangramino/engine';

// 操作 Schema
const newSchema = SchemaUtils.insertElement(currentSchema, parentId, newElement);
```
