# Tangramino

[English](./README.md) | 简体中文

<p align="center">
  <strong>灵活的 Schema 驱动低代码框架，用于构建可视化编辑器和工作流设计器。</strong>
</p>

Tangramino 为构建低代码平台提供了完整的解决方案，从 Schema 管理到可视化编辑。凭借其框架无关的引擎和模块化架构，您可以轻松构建拖拽页面搭建器、流程设计器和定制化低代码工具。

## ✨ 核心特性

- 🎯 **Schema 驱动**：基于 JSONSchema 的架构，用于定义 UI 结构、行为和数据流
- 🔌 **框架无关**：核心引擎与 UI 框架无关，官方提供 React 绑定
- 🎨 **可视化编辑**：生产级拖拽编辑器和流程图设计器
- 🔧 **插件系统**：可扩展的架构，支持自定义插件和组件
- 📦 **模块化**：可组合的包 - 单独使用引擎或构建完整的编辑体验
- 🛡️ **类型安全**：完整的 TypeScript 支持和类型定义

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
- 包管理器：npm、yarn 或 pnpm

### 安装

根据您的使用场景选择包：

**构建拖拽页面编辑器：**

```bash
npm install @tangramino/base-editor
```

**构建工作流/流程编辑器：**

```bash
npm install @tangramino/flow-editor
```

**自定义实现（引擎 + 视图层）：**

```bash
# Schema 引擎（框架无关）
npm install @tangramino/engine

# React 视图绑定
npm install @tangramino/react
```

### 基础拖拽编辑器

不到 30 行代码创建一个最小化的低代码编辑器：

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';
import '@tangramino/base-editor/style';

// 定义组件物料
const materials = [
  {
    type: 'button',
    title: '按钮',
    Component: ({ children, ...props }) => <button {...props}>{children}</button>,
    props: { children: '点击我' }
  },
  {
    type: 'text',
    title: '文本',
    Component: ({ content }) => <p>{content}</p>,
    props: { content: 'Hello World' }
  }
];

function App() {
  return (
    <EditorProvider materials={materials}>
      <div style={{ height: '100vh' }}>
        <CanvasEditor />
      </div>
    </EditorProvider>
  );
}

export default App;
```

### 纯渲染模式

使用 `@tangramino/react` 渲染 Schema，无需编辑功能：

```tsx
import React from 'react';
import { View } from '@tangramino/react';
import { createEngine } from '@tangramino/engine';

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
    structure: { root: ['btn-1'] }
  }
};

const materials = [
  { type: 'button', Component: (props) => <button {...props} /> }
];

function App() {
  const engine = React.useMemo(() => createEngine(schema), []);
  return <View engine={engine} components={{ button: materials[0].Component }} />;
}
```

## 💡 示例与演示

### 全功能低代码编辑器

查看 [`playground/antd-demo`](./playground/antd-demo) 中的生产级演示：

**功能亮点：**
- 🎨 **物料面板**：拖拽组件库，包含 25+ Ant Design 组件
- 🖼️ **可视化画布**：实时编辑，支持元素选择和定位
- ⚙️ **属性面板**：选中元素的动态属性配置
- 🔄 **历史记录**：完整的撤销/重做支持
- 💾 **持久化**：Schema 导入/导出（JSON）
- 📱 **预览**：多设备视口模拟
- 🧩 **逻辑设计器**：可视化工作流编辑器，用于复杂交互

**本地运行：**

```bash
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino
pnpm install
pnpm dev:antd  # 打开 http://localhost:5173
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

详尽的指南和 API 参考文档请访问 [keiseiti.github.io/tangramino](https://keiseiti.github.io/tangramino/)

**必读文档：**
- **[快速开始](https://keiseiti.github.io/tangramino/guide/start/introduce.html)** - 安装和第一步
- **[Schema 概念](https://keiseiti.github.io/tangramino/guide/concept/schema.html)** - 理解数据结构
- **[自定义编辑器](https://keiseiti.github.io/tangramino/guide/advanced/custom-editor.html)** - 构建定制化编辑体验
- **[插件开发](https://keiseiti.github.io/tangramino/guide/plugin.html)** - 扩展功能

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
