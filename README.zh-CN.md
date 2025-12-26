# Tangramino

[English](./README.md) | 简体中文

<p align="center">
  <strong>灵活的 Schema 驱动低代码框架，用于构建可视化编辑器和工作流设计器。</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@tangramino/engine"><img src="https://img.shields.io/npm/v/@tangramino/engine" alt="npm version" /></a>
  <a href="https://github.com/keiseiTi/tangramino/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@tangramino/engine" alt="license" /></a>
</p>

## ✨ 特性

| 特性               | 描述                                         |
| ------------------ | -------------------------------------------- |
| 🎯 **Schema 驱动** | 基于 JSON 的架构，定义 UI 结构、行为和数据流 |
| 🔌 **框架无关**    | 核心引擎与 UI 无关，提供 React 绑定          |
| 🎨 **可视化编辑**  | 生产级拖拽编辑器和流程设计器                 |
| 🔧 **插件系统**    | 可扩展架构，支持自定义插件                   |
| 📦 **模块化**      | 单独使用引擎或构建完整编辑体验               |
| 🛡️ **类型安全**    | 完整的 TypeScript 支持                       |

## 📦 核心包

| 包名                                                | 描述                              | 版本                                                                                                                  |
| --------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`@tangramino/engine`](./packages/engine)           | 框架无关的 JSON Schema 引擎       | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine)           |
| [`@tangramino/react`](./packages/react)             | React 绑定，提供 hooks 和视图渲染 | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react)             |
| [`@tangramino/base-editor`](./packages/base-editor) | 可视化拖拽编辑器框架              | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| [`@tangramino/flow-editor`](./packages/flow-editor) | 专业的流程图编辑器                | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## 🎯 如何选择？

| 你的目标                    | 推荐使用                                       |
| --------------------------- | ---------------------------------------------- |
| 将 Schema 渲染为 React 组件 | `@tangramino/react`                            |
| 构建拖拽页面编辑器          | `@tangramino/base-editor`                      |
| 构建工作流/流程设计器       | `@tangramino/flow-editor`                      |
| 自定义实现，完全控制        | `@tangramino/engine` + `@tangramino/react`     |
| 学习完整示例                | [playground/antd-demo](./playground/antd-demo) |

## 🏗️ 架构

```
┌─────────────────────────────────────────────────────────┐
│  编辑器层 (@tangramino/base-editor, flow-editor)        │
│  • 拖拽交互  • 物料系统  • 画布与选择                    │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│         视图层 (@tangramino/react)                       │
│  • 组件渲染  • Hooks & HOC  • 事件绑定                   │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│         引擎层 (@tangramino/engine)                      │
│  • Schema 管理  • 事件系统  • 状态控制                   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 拖拽编辑器

```bash
npm install @tangramino/base-editor
```

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor, Draggable, useEditorCore } from '@tangramino/base-editor';

const materials = [
  {
    type: 'button',
    title: '按钮',
    Component: (props) => <button {...props}>{props.children || '点击'}</button>,
    defaultProps: { children: '按钮' },
  },
];

function App() {
  return (
    <EditorProvider materials={materials}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <MaterialPanel />
        <CanvasEditor style={{ flex: 1 }} />
      </div>
    </EditorProvider>
  );
}

function MaterialPanel() {
  const { materials } = useEditorCore();
  return (
    <div style={{ width: 200, padding: 16 }}>
      {materials.map((m) => (
        <Draggable key={m.type} material={m}>
          <div style={{ padding: 8, border: '1px solid #ddd', marginBottom: 8, cursor: 'move' }}>
            {m.title}
          </div>
        </Draggable>
      ))}
    </div>
  );
}
```

### 纯渲染模式

```tsx
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { children: '点击我' } },
  },
  layout: { root: 'root', structure: { root: ['btn-1'] } },
};

const engine = createEngine(schema);

function App() {
  return (
    <ReactView
      engine={engine}
      components={{
        container: ({ children }) => <div>{children}</div>,
        button: (props) => <button {...props} />,
      }}
    />
  );
}
```

### 流程编辑器

```tsx
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';

const nodeTypes = [
  {
    type: 'start',
    title: '开始',
    renderNode: () => <div className='node-start'>开始</div>,
  },
  {
    type: 'action',
    title: '动作',
    renderNode: ({ data }) => <div className='node-action'>{data.name || '动作'}</div>,
  },
];

function App() {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });

  return (
    <FlowEditor nodes={nodeTypes} value={flowData} onChange={setFlowData}>
      <EditorRenderer />
    </FlowEditor>
  );
}
```

## 💡 演示

体验包含 25+ Ant Design 组件的生产级演示：

```bash
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino
pnpm install
pnpm dev:antd  # http://localhost:5173
```

**功能亮点：** 物料面板 • 可视化画布 • 属性编辑 • 撤销/重做 • Schema 操作 • 预览 • 流程设计器

## 📖 文档

- **[快速开始](https://keiseiti.github.io/tangramino/guide/start/introduce.html)**
- **[Schema 概念](https://keiseiti.github.io/tangramino/guide/concept/schema.html)**
- **[物料系统](https://keiseiti.github.io/tangramino/guide/concept/material.html)**
- **[插件开发](https://keiseiti.github.io/tangramino/guide/concept/plugin.html)**
- **[API 参考](https://keiseiti.github.io/tangramino/api/engine.html)**

## 🛠️ 开发

```bash
pnpm install     # 安装依赖
pnpm watch       # 监听模式
pnpm dev:antd    # 运行演示
pnpm build       # 构建所有包
```

## 🤝 贡献

欢迎贡献！请参阅 [贡献指南](./contribution.md)。

## 📄 许可证

[MIT](LICENSE) © Tangramino
