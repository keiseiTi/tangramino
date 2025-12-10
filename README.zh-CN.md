# Tangramino

[English](./README.md) | 简体中文

Tangramino 是一个模块化、Schema 驱动的可视化编辑器框架，可用于构建低代码平台、拖拽界面和流程编辑器等。Tangramino 将核心逻辑引擎与视图层分离，提供最大的灵活性和可扩展性。

## ✨ 核心特性

- 🎯 **Schema 驱动架构**：使用强大的 JSONSchema 格式定义 UI 结构和逻辑
- 🔌 **框架无关核心**：引擎层完全与 UI 框架解耦，理论上可适配 React、 Vue、Svelte 等框架
- 🎨 **可视化编辑器**：开箱即用的拖拽和流程图编辑器
- 🔧 **高度可扩展**：插件系统和自定义组件支持
- 📦 **模块化设计**：按需使用 - 从引擎到完整编辑器
- 🛡️ **类型安全**：使用 TypeScript 编写，提供完整的类型定义

## 📦 核心包

| 包名 | 描述 | 版本 |
| --- | --- | --- |
| **[`@tangramino/engine`](./packages/engine)** | 框架无关的核心引擎，负责 Schema 管理、事件处理和数据操作 | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine) |
| **[`@tangramino/react`](./packages/react)** | 引擎的 React 绑定，提供 hooks、HOC 和视图渲染能力 | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react) |
| **[`@tangramino/base-editor`](./packages/base-editor)** | 可视化拖拽编辑器，包含物料系统、画布管理和 dnd-kit 集成 | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| **[`@tangramino/flow-editor`](./packages/flow-editor)** | 专业的流程图编辑器，用于工作流设计和逻辑编排 | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## 🏗️ 架构

Tangramino 采用清晰的分层架构，促进关注点分离：

```
┌─────────────────────────────────────────────────────────┐
│  编辑器层 (@tangramino/base-editor, flow-editor)       │
│  - 拖拽 UI                                               │
│  - 物料管理                                              │
│  - 画布与选择                                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         视图层 (@tangramino/react)                       │
│  - React 组件树渲染                                      │
│  - Hooks 与 HOC                                          │
│  - 事件监听                                              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         引擎层 (@tangramino/engine)                      │
│  - JSONSchema 管理                                       │
│  - 元素 CRUD 操作                                        │
│  - 事件系统                                              │
│  - 框架无关                                              │
└─────────────────────────────────────────────────────────┘
```

**层次说明：**

1. **引擎层** (`@tangramino/engine`)：管理 JSONSchema，处理事件，提供数据操作 API。完全与 UI 无关。
2. **视图层** (`@tangramino/react`)：将引擎绑定到 React，监听引擎事件，基于 Schema 渲染组件树。
3. **编辑器层** (`@tangramino/base-editor`, `@tangramino/flow-editor`)：提供完整的编辑体验，包括拖拽、选择、属性面板等。

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm 或 yarn 或 pnpm

### 安装

**完整的拖拽编辑器：**

```bash
npm install @tangramino/base-editor
# 或
pnpm add @tangramino/base-editor
```

**流程图编辑器：**

```bash
npm install @tangramino/flow-editor
# 或
pnpm add @tangramino/flow-editor
```

**自定义集成：**

```bash
# 仅框架无关的引擎
npm install @tangramino/engine

# React 绑定
npm install @tangramino/react
```

### 基础拖拽编辑器

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';
import '@tangramino/base-editor/style';

// 1. 定义物料（编辑器中可用的组件）
const materials = [
  {
    type: 'button',
    title: '按钮',
    Component: ({ children, ...props }) => <button {...props}>{children}</button>,
    props: { 
      children: '点击我',
      type: 'primary'
    }
  },
  {
    type: 'text',
    title: '文本',
    Component: ({ content }) => <p>{content}</p>,
    props: { 
      content: 'Hello World' 
    }
  }
];

// 2. 创建编辑器
function App() {
  return (
    <EditorProvider materials={materials}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '16px', background: '#f0f0f0' }}>
          <h1>我的低代码编辑器</h1>
        </header>
        <div style={{ flex: 1, padding: '20px' }}>
          <CanvasEditor />
        </div>
      </div>
    </EditorProvider>
  );
}

export default App;
```

### 基础 Schema 渲染

如果只需要渲染 Schema 而不需要编辑功能：

```tsx
import React from 'react';
import { View } from '@tangramino/react';

const schema = {
  elements: {
    'btn-1': { 
      id: 'btn-1', 
      type: 'button', 
      props: { children: '点击我' } 
    }
  },
  layout: {
    root: 'root',
    structure: { 
      'root': ['btn-1'] 
    }
  }
};

const materials = [
  {
    type: 'button',
    Component: (props) => <button {...props} />
  }
];

function App() {
  return <View schema={schema} materials={materials} />;
}
```

## 💡 示例

### 完整的低代码编辑器

查看我们在 [`playground/antd-demo`](./playground/antd-demo) 中的综合示例，包含：

- 🎨 支持拖拽的物料面板
- 🖼️ 支持元素选择的可视化画布
- ⚙️ 属性配置面板
- 🔄 撤销/重做支持
- 💾 Schema 导出/导入
- 📱 预览模式
- 🎯 与 Ant Design 组件集成

**运行示例：**

```bash
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino
pnpm install
pnpm dev:antd
```

### 流程编辑器

```tsx
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import '@tangramino/flow-editor/index.css';

const flowNodes = [
  {
    type: 'start',
    title: '开始节点',
    nodeMeta: {
      isStart: true,
      defaultPorts: [{ type: 'output' }]
    },
    renderNode: ({ data }) => <div className="node-start">{data.title}</div>
  }
];

function FlowApp() {
  const [flowData, setFlowData] = React.useState({ nodes: [], edges: [] });

  return (
    <FlowEditor 
      nodes={flowNodes} 
      value={flowData} 
      onChange={setFlowData}
    >
      <div style={{ height: '100vh' }}>
        <EditorRenderer />
      </div>
    </FlowEditor>
  );
}
```

## 📖 文档

访问我们的综合 [文档站点](https://keiseiti.github.io/tangramino/) 获取：

- [快速开始指南](https://keiseiti.github.io/tangramino/guide/start/introduce.html)
- [核心概念](https://keiseiti.github.io/tangramino/guide/concept/schema.html)
- [进阶主题](https://keiseiti.github.io/tangramino/guide/advanced/custom-editor.html)
- [插件开发](https://keiseiti.github.io/tangramino/guide/plugin.html)

## 🎯 应用场景

- **低代码平台**：构建拖拽式页面构建器
- **表单构建器**：创建动态表单设计器
- **工作流引擎**：设计可视化工作流和自动化工具
- **仪表盘构建器**：构建可自定义的仪表盘创建器
- **移动应用构建器**：创建移动端 UI 设计器

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino

# 安装依赖
pnpm install

# 开发模式下监听所有包
pnpm watch

# 运行示例
pnpm dev:antd

# 构建所有包
pnpm build

# 运行文档站点
pnpm site
```

## 🤝 贡献指南

我们欢迎来自社区的贡献！无论是：

- 🐛 错误报告
- 💡 功能请求
- 📝 文档改进
- 🔧 代码贡献

详情请参阅我们的 [贡献指南](./site/docs/contribution.md)，了解：

- 如何搭建开发环境
- 代码风格和约定
- 如何提交 Pull Request
- 如何运行测试

## 📄 开源协议

[MIT](LICENSE) © Tangramino

---

Made with ❤️ by the Tangramino team
