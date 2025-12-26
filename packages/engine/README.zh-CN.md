# @tangramino/engine

[English](./README.md) | 简体中文

---

**框架无关的 JSON Schema 引擎**

Tangramino 的核心基础 —— 轻量级纯 TypeScript 引擎，用于管理页面结构、事件处理和状态同步。零 UI 依赖，可与 React、Vue 或任何前端框架配合使用。

## ✨ 特性

| 特性               | 描述                       |
| ------------------ | -------------------------- |
| 🎯 **Schema 驱动** | 基于 JSON 的页面结构定义   |
| 📦 **框架无关**    | 零 UI 依赖 —— 纯数据层     |
| 🔄 **事件系统**    | 发布/订阅机制实现状态同步  |
| 🛡️ **类型安全**    | 完整的 TypeScript 类型支持 |
| ⚡ **不可变更新**  | 基于 Immer 的高效状态管理  |
| 🔧 **Schema 工具** | 内置 CRUD 操作工具函数     |

## 📦 安装

```bash
npm install @tangramino/engine
```

## 🚀 快速开始

```typescript
import { createEngine, SchemaUtils } from '@tangramino/engine';

// 1. 定义 Schema
const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { text: '点击我' } },
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] },
  },
};

// 2. 创建引擎实例
const engine = createEngine(schema);

// 3. 订阅变更
engine.on('app', 'ELEMENT_UPDATE', () => {
  console.log('Schema 已更新:', engine.elements);
});

// 4. 更新状态
engine.setState({ 'btn-1': { text: '已更新!' } });
```

## 📖 核心概念

### Schema 结构

```typescript
interface Schema {
  elements: Record<string, ElementState>; // 扁平化元素存储
  layout: {
    root: string; // 根节点 ID
    structure: Record<string, string[]>; // 父子关系映射
  };
  extensions?: Record<string, unknown>; // 扩展数据
  flows?: Flows; // 流程编排
  bindElements?: BindElement[]; // 元素流程绑定关系
  context?: { globalVariables?: GlobalVariable[] };
}
```

### SchemaUtils 工具

```typescript
import { SchemaUtils } from '@tangramino/engine';

// 插入元素
SchemaUtils.insertElement(schema, parentId, element, index?);

// 更新属性
SchemaUtils.setElementProps(schema, elementId, props);

// 移动元素
SchemaUtils.moveElement(schema, elementId, newParentId, index?);

// 删除元素
SchemaUtils.removeElement(schema, elementId);

// 获取父级链
SchemaUtils.getParents(schema, elementId);
```

## 🔨 API 参考

### 引擎实例方法

| 方法                             | 描述         |
| -------------------------------- | ------------ |
| `setState(state)`                | 更新元素属性 |
| `getState(id?)`                  | 获取元素状态 |
| `showElements(ids)`              | 显示元素     |
| `hiddenElements(ids)`            | 隐藏元素     |
| `setGlobalVariable(key, value)`  | 设置全局变量 |
| `getGlobalVariable(key)`         | 获取全局变量 |
| `on(namespace, event, listener)` | 订阅事件     |
| `emit(namespace, event, data)`   | 发布事件     |

## 📄 License

MIT
