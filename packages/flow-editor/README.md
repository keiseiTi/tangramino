# @tangramino/flow-editor

基于 React Flow 的专业流程图编辑器组件，适用于逻辑编排、工作流设计等场景。

## ✨ 特性

- **节点系统**：支持自定义节点类型、外观和配置表单。
- **连线控制**：灵活的连线规则控制。
- **插件扩展**：支持插件机制，如自由连线等。
- **状态管理**：内置状态管理，轻松获取和修改流程图数据。

## 📦 安装

```bash
npm install @tangramino/flow-editor
# 或者
yarn add @tangramino/flow-editor
```

## 🔨 快速开始

### 1. 定义节点

```typescript
import type { FlowNode } from '@tangramino/flow-editor';

const StartNode: FlowNode = {
  type: 'start',
  title: '开始',
  nodeMeta: {
    isStart: true,
    defaultPorts: [{ type: 'output' }],
  },
  renderNode: ({ data }) => <div>{data.title}</div>,
};
```

### 2. 使用编辑器

```tsx
import React, { useState } from 'react';
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';

const nodes = [StartNode];

const App = () => {
  const [value, setValue] = useState({ nodes: [], edges: [] });

  return (
    <FlowEditor nodes={nodes} value={value} onChange={setValue}>
       <div style={{ display: 'flex', height: '100vh' }}>
          {/* 左侧节点选择面板 */}
          <div className="node-panel">...</div>

          {/* 核心画布 */}
          <div style={{ flex: 1 }}>
             <EditorRenderer />
          </div>
       </div>
    </FlowEditor>
  );
};
```

## 核心 API

### `FlowEditor`

流程编辑器容器。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `nodes` | `FlowNode[]` | 注册的节点定义列表 |
| `value` | `FlowGraphData` | 流程图数据 (nodes, edges) |
| `onChange` | `(val: FlowGraphData) => void` | 数据变更回调 |
| `canAddLine` | `Function` | 连线校验函数 |

### `EditorRenderer`

负责渲染流程图画布的组件，必须作为 `FlowEditor` 的子组件使用。
