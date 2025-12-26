# @tangramino/engine

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>

**Framework-agnostic JSON Schema engine for low-code platforms**

The foundation of Tangramino — a lightweight, pure TypeScript engine for managing page structures, event handling, and state synchronization. Zero UI dependencies, works with React, Vue, or any frontend framework.

[![npm version](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@tangramino/engine)](https://bundlephobia.com/package/@tangramino/engine)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Schema-Driven** | JSON-based page structure definition |
| 📦 **Framework Agnostic** | Zero UI dependencies — pure data layer |
| 🔄 **Event System** | Pub/sub mechanism for state synchronization |
| 🛡️ **Type-Safe** | Full TypeScript support with comprehensive types |
| ⚡ **Immutable Updates** | Built on Immer for efficient state management |
| 🔧 **Schema Utils** | Built-in utilities for CRUD operations |

## 📦 Installation

```bash
npm install @tangramino/engine
# or
pnpm add @tangramino/engine
# or
yarn add @tangramino/engine
```

## 🚀 Quick Start

```typescript
import { createEngine, SchemaUtils } from '@tangramino/engine';

// 1. Define your schema
const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { text: 'Click Me' } }
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] }
  }
};

// 2. Create engine instance
const engine = createEngine(schema);

// 3. Subscribe to changes
engine.on('app', 'ELEMENT_UPDATE', () => {
  console.log('Schema updated:', engine.elements);
});

// 4. Update state
engine.setState({ 'btn-1': { text: 'Updated!' } });
```

## 📖 Core Concepts

### Schema Structure

Schema is a flat JSON structure optimized for efficient lookups:

```typescript
interface Schema {
  // Flat element storage (O(1) access)
  elements: Record<string, ElementState>;
  
  // Layout tree (parent-child relationships)
  layout: {
    root: string;
    structure: Record<string, string[]>;
  };
  
  // Optional extensions
  extensions?: Record<string, unknown>;
  flows?: Record<string, Flow>;        // Flow orchestration
  context?: { globalVariables?: GlobalVariable[] };
}

interface ElementState {
  type: string;                    // Component type
  props: Record<string, unknown>;  // Component props
  hidden?: boolean;                // Visibility
}
```

**Example:**

```typescript
const schema = {
  elements: {
    root: { type: 'page', props: { title: 'My App' } },
    header: { type: 'container', props: { className: 'header' } },
    'btn-1': { type: 'button', props: { children: 'Click' } }
  },
  layout: {
    root: 'root',
    structure: {
      root: ['header'],
      header: ['btn-1']
    }
  }
};
```

### SchemaUtils

Built-in utilities for schema manipulation:

```typescript
import { SchemaUtils } from '@tangramino/engine';

// Insert element
const newSchema = SchemaUtils.insertElement(schema, 'root', {
  type: 'input',
  props: { placeholder: 'Enter...' }
}, 0);

// Update props
const updated = SchemaUtils.setElementProps(schema, 'btn-1', {
  text: 'New Text'
});

// Move element
const moved = SchemaUtils.moveElement(schema, 'btn-1', 'header', 0);

// Remove element
const removed = SchemaUtils.removeElement(schema, 'btn-1');

// Get parent chain
const parents = SchemaUtils.getParents(schema, 'btn-1');
// → ['root', 'header']
```

## 🔨 API Reference

### Engine Instance

```typescript
const engine = createEngine(schema);
```

| Method | Description |
|--------|-------------|
| `engine.elements` | Get all elements |
| `engine.layouts` | Get layout structure |
| `engine.setState(state)` | Update element props |
| `engine.getState(id?)` | Get element state |
| `engine.showElements(ids)` | Show hidden elements |
| `engine.hiddenElements(ids)` | Hide elements |
| `engine.setGlobalVariable(key, value)` | Set global variable |
| `engine.getGlobalVariable(key)` | Get global variable |
| `engine.setExtensions(field, value)` | Store extension data |
| `engine.getExtensions(field)` | Retrieve extension data |

### Event System

```typescript
import { ELEMENT_UPDATE, VIEW_UPDATE } from '@tangramino/engine';

// Subscribe to events
engine.on('myApp', ELEMENT_UPDATE, (data) => {
  console.log('Elements changed:', data);
});

// One-time listener
engine.once('myApp', VIEW_UPDATE, () => {
  console.log('View updated once');
});

// Emit custom events
engine.emit('myApp', 'customEvent', { foo: 'bar' });
```

### Global Variables

```typescript
// Set
engine.setGlobalVariable('userName', 'John');

// Get
const userName = engine.getGlobalVariable('userName');
```

### Callback Injection

Inject dynamic callbacks for runtime behavior:

```typescript
engine.injectCallback('btn-1', 'onClick', () => {
  console.log('Button clicked!');
});
```

## 🔗 Integration

### With React

```tsx
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

const engine = createEngine(schema);

function App() {
  return (
    <ReactView 
      engine={engine}
      components={{
        button: MyButton,
        input: MyInput,
        container: MyContainer
      }}
    />
  );
}
```

### With Base Editor

```tsx
import { createEngine } from '@tangramino/engine';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';

function Editor() {
  return (
    <EditorProvider materials={materials} schema={schema}>
      <CanvasEditor />
    </EditorProvider>
  );
}
```

---

<a name="简体中文"></a>

# @tangramino/engine

**框架无关的 JSON Schema 引擎**

Tangramino 的核心基础 —— 轻量级纯 TypeScript 引擎，用于管理页面结构、事件处理和状态同步。零 UI 依赖，可与 React、Vue 或任何前端框架配合使用。

## ✨ 特性

| 特性 | 描述 |
|------|------|
| 🎯 **Schema 驱动** | 基于 JSON 的页面结构定义 |
| 📦 **框架无关** | 零 UI 依赖 —— 纯数据层 |
| 🔄 **事件系统** | 发布/订阅机制实现状态同步 |
| 🛡️ **类型安全** | 完整的 TypeScript 类型支持 |
| ⚡ **不可变更新** | 基于 Immer 的高效状态管理 |
| 🔧 **Schema 工具** | 内置 CRUD 操作工具函数 |

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
    'btn-1': { type: 'button', props: { text: '点击我' } }
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] }
  }
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
  elements: Record<string, ElementState>;  // 扁平化元素存储
  layout: {
    root: string;                          // 根节点 ID
    structure: Record<string, string[]>;   // 父子关系映射
  };
  extensions?: Record<string, unknown>;    // 扩展数据
  flows?: Record<string, Flow>;            // 流程编排
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

| 方法 | 描述 |
|------|------|
| `setState(state)` | 更新元素属性 |
| `getState(id?)` | 获取元素状态 |
| `showElements(ids)` | 显示元素 |
| `hiddenElements(ids)` | 隐藏元素 |
| `setGlobalVariable(key, value)` | 设置全局变量 |
| `getGlobalVariable(key)` | 获取全局变量 |
| `on(namespace, event, listener)` | 订阅事件 |
| `emit(namespace, event, data)` | 发布事件 |

## 📄 License

MIT
