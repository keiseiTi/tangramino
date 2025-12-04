# Tangramino

[English](./README.md) | 简体中文

Tangramino 是一个强大、模块化且基于 Schema 驱动的可视化编辑器框架。它将核心逻辑引擎与视图层分离，从而实现灵活且可扩展的应用程序开发。Tangramino 为构建拖拽界面、流程编辑器以及其他复杂的可视化工具提供了坚实的基础。

## 📦 核心包

| 包名 | 描述 | 版本 |
| --- | --- | --- |
| **[`@tangramino/engine`](./packages/engine)** | 核心 Schema 引擎，负责处理数据、事件和逻辑。与框架无关。 | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine) |
| **[`@tangramino/react`](./packages/react)** | 引擎的 React 绑定和视图层。 | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react) |
| **[`@tangramino/base-editor`](./packages/base-editor)** | 基于引擎构建的可视化拖拽编辑器组件。 | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| **[`@tangramino/flow-editor`](./packages/flow-editor)** | 专业的流程图可视化编辑器组件。 | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## ✨ 特性

- **Schema 驱动**：使用强大的 JSONSchema 格式定义应用程序结构和逻辑。
- **框架无关核心**：核心引擎与 UI 解耦，未来可支持 Vue、Angular 或原生 JS。
- **React 集成**：通过 `@tangramino/react` 与 React 无缝集成。
- **可视化编辑**：提供开箱即用的组件，用于构建拖拽和基于节点的流程编辑器。
- **可扩展性**：设计之初就考虑了插件和自定义组件的扩展。
- **TypeScript**：完全使用 TypeScript 编写，提供类型安全和卓越的开发体验。

## 🏗 架构

Tangramino 采用分层架构设计：

1.  **引擎层 (`@tangramino/engine`)**: 管理 JSONSchema，处理事件，并提供操作文档结构的 API。它完全不感知 UI。
2.  **视图层 (`@tangramino/react`)**: 将引擎绑定到 React。它监听引擎事件并根据 Schema 渲染 React 组件树。
3.  **编辑器层 (`@tangramino/base-editor`, `@tangramino/flow-editor`)**: 提供用于编辑的 UI 组件，例如拖拽处理、选择工具和画布管理。

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm 或 yarn 或 pnpm

### 安装

如果你要构建可视化拖拽编辑器，只需安装 base-editor 包（它包含了引擎和 react 绑定）：

```bash
npm install @tangramino/base-editor
```

### 基础使用

下面是一个最简单的编辑器搭建示例：

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';

// 1. 定义物料 (编辑器中可用的组件)
const materials = [
  {
    type: 'button',
    title: '按钮',
    Component: ({ children }) => <button>{children}</button>,
    props: { children: '点击我' }
  }
];

// 2. 创建编辑器
const App = () => {
  return (
    <EditorProvider materials={materials}>
      <div style={{ height: '100vh', padding: 20 }}>
        <h1>我的编辑器</h1>
        <CanvasEditor />
      </div>
    </EditorProvider>
  );
};

export default App;
```

查看 [playground/antd-demo](./playground/antd-demo) 获取包含拖拽侧边栏、属性面板等功能的完整低代码编辑器示例。

## 📖 文档

访问我们的 [文档站点](https://keiseiti.github.io/tangramino/) 获取详细指南和 API 参考。

- [介绍](https://keiseiti.github.io/tangramino/guide/start/introduce.html)
- [自定义编辑器指南](./site/docs/guide/advanced/custom-editor.md)
- [流程编辑器指南](./site/docs/guide/advanced/custom-flow-editor.md)
- [插件开发](./site/docs/guide/plugin.md)

## 🤝 贡献指南

我们需要你的帮助！详情请参阅我们的 [贡献指南](./site/docs/contribution.md)，了解如何搭建开发环境并提交 Pull Request。

## 📄 开源协议

[MIT](LICENSE) © Tangramino
