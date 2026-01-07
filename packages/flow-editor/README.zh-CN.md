# @tangramino/flow-editor

[English](./README.md) | 简体中文

---

**专业的流程图编辑器**

构建可视化工作流设计器、逻辑编排器和节点式编辑器。适用于业务流程自动化、数据管道和事件驱动架构。

## ✨ 特性

| 特性            | 描述                   |
| --------------- | ---------------------- |
| 🎯 **节点系统** | 定义自定义节点类型     |
| 🔗 **连接控制** | 灵活的端口和连接验证   |
| 🔌 **插件支持** | 通过插件扩展功能       |
| 📊 **状态管理** | 内置流程数据管理       |
| 🎨 **可定制**   | 完全控制节点渲染       |
| 🛡️ **类型安全** | 完整的 TypeScript 支持 |

## 📦 安装

```bash
npm install @tangramino/flow-editor
```

## 🚀 快速开始

```tsx
import React, { useState } from 'react';
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
    renderConfig: ({ data, onChange }) => (
      <input
        value={data.name || ''}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder='动作名称'
      />
    ),
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

## 📘 API 参考

### `<FlowEditor />`

| 属性         | 类型                          | 必填 | 描述         |
| ------------ | ----------------------------- | :--: | ------------ |
| `nodes`      | `FlowNode[]`                  |  ✓   | 节点类型定义 |
| `value`      | `FlowGraphData`               |  ✓   | 当前流程数据 |
| `onChange`   | `(data) => void`              |  ✓   | 变更回调     |
| `canAddLine` | `(source, target) => boolean` |      | 连接验证器   |

### `useFlowContext()`

```typescript
const {
  nodes, // 节点类型定义
  flowData, // 当前节点和连线
  selectedNode, // 选中的节点
  addNode, // 添加节点
  removeNode, // 删除节点
  updateNodeData, // 更新节点数据
} = useFlowContext();
```

### 节点定义

```typescript
interface FlowNode {
  type: string; // 唯一标识符
  title: string; // 显示名称
  nodeMeta?: {
    isStart?: boolean; // 是否为起始节点
    isEnd?: boolean; // 是否为结束节点
    category?: string; // 分类
  };
  renderNode: (props) => ReactNode;
  renderConfig?: (props) => ReactNode;
}
```
