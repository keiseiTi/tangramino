# @tangramino/flow-editor

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>

**Professional flow diagram editor for workflow design**

Build visual workflow designers, logic orchestrators, and node-based editors. Perfect for business process automation, data pipelines, and event-driven architectures.

[![npm version](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Node System** | Define custom node types with renderers |
| 🔗 **Connection Control** | Flexible port and connection validation |
| 🔌 **Plugin Support** | Extend with custom plugins |
| 📊 **State Management** | Built-in flow data management |
| 🎨 **Customizable** | Complete control over node rendering |
| 🛡️ **Type-Safe** | Full TypeScript support |

## 📦 Installation

```bash
npm install @tangramino/flow-editor
```

> **Peer dependencies:** `react`, `react-dom`

## 🚀 Quick Start

### Basic Flow Editor

```tsx
import React, { useState } from 'react';
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import '@tangramino/flow-editor/index.css';

// Define node types
const nodeTypes = [
  {
    type: 'start',
    title: 'Start',
    nodeMeta: { isStart: true },
    renderNode: () => (
      <div style={{ padding: 16, background: '#52c41a', color: '#fff', borderRadius: 8 }}>
        Start
      </div>
    )
  },
  {
    type: 'action',
    title: 'Action',
    renderNode: ({ data }) => (
      <div style={{ padding: 16, background: '#1890ff', color: '#fff', borderRadius: 4 }}>
        {data.name || 'Action'}
      </div>
    ),
    renderConfig: ({ data, onChange }) => (
      <div>
        <label>Name:</label>
        <input
          value={data.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
    )
  },
  {
    type: 'end',
    title: 'End',
    nodeMeta: { isEnd: true },
    renderNode: () => (
      <div style={{ padding: 16, background: '#ff4d4f', color: '#fff', borderRadius: '50%' }}>
        End
      </div>
    )
  }
];

function App() {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });

  return (
    <FlowEditor nodes={nodeTypes} value={flowData} onChange={setFlowData}>
      <div style={{ height: '100vh' }}>
        <EditorRenderer />
      </div>
    </FlowEditor>
  );
}
```

### With Node Panel & Config Panel

```tsx
import { FlowEditor, EditorRenderer, useFlowContext } from '@tangramino/flow-editor';

function NodePanel() {
  const { nodes, addNode } = useFlowContext();
  
  return (
    <div style={{ width: 200, padding: 16, borderRight: '1px solid #ddd' }}>
      <h4>Nodes</h4>
      {nodes.map(node => (
        <button
          key={node.type}
          onClick={() => addNode(node.type)}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        >
          {node.title}
        </button>
      ))}
    </div>
  );
}

function ConfigPanel() {
  const { selectedNode, nodes, updateNodeData } = useFlowContext();
  
  if (!selectedNode) {
    return <div style={{ width: 250, padding: 16 }}>Select a node</div>;
  }
  
  const nodeType = nodes.find(n => n.type === selectedNode.type);
  const ConfigRenderer = nodeType?.renderConfig;
  
  return (
    <div style={{ width: 250, padding: 16, borderLeft: '1px solid #ddd' }}>
      <h4>Configuration</h4>
      {ConfigRenderer && (
        <ConfigRenderer 
          data={selectedNode.data} 
          onChange={(data) => updateNodeData(selectedNode.id, data)}
        />
      )}
    </div>
  );
}

function App() {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });

  return (
    <FlowEditor nodes={nodeTypes} value={flowData} onChange={setFlowData}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <NodePanel />
        <div style={{ flex: 1 }}>
          <EditorRenderer />
        </div>
        <ConfigPanel />
      </div>
    </FlowEditor>
  );
}
```

## 📘 API Reference

### `<FlowEditor />`

Container component providing flow editor context.

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `nodes` | `FlowNode[]` | ✓ | Node type definitions |
| `value` | `FlowGraphData` | ✓ | Current flow data |
| `onChange` | `(data) => void` | ✓ | Change callback |
| `canAddLine` | `(source, target) => boolean` | | Connection validator |
| `plugins` | `Plugin[]` | | Flow editor plugins |

```tsx
<FlowEditor
  nodes={nodeTypes}
  value={{ nodes: [], edges: [] }}
  onChange={setFlowData}
  canAddLine={(source, target) => source.type !== 'end'}
>
  <EditorRenderer />
</FlowEditor>
```

### `<EditorRenderer />`

Canvas component for rendering the flow diagram.

| Prop | Type | Description |
|------|------|-------------|
| `fitView` | `boolean` | Auto-fit view on load |
| `snapToGrid` | `boolean` | Enable grid snapping |

```tsx
<EditorRenderer fitView snapToGrid />
```

### `useFlowContext()`

Hook for accessing flow editor state and methods.

```typescript
const {
  // State
  nodes,           // Node type definitions
  flowData,        // Current nodes & edges
  selectedNode,    // Selected node
  
  // Methods
  addNode,         // Add new node
  removeNode,      // Remove node
  updateNodeData,  // Update node data
  addEdge,         // Add connection
  removeEdge,      // Remove connection
} = useFlowContext();
```

### `FlowNode` Definition

```typescript
interface FlowNode {
  type: string;                    // Unique identifier
  title: string;                   // Display name
  nodeMeta?: {
    isStart?: boolean;             // Mark as start node
    isEnd?: boolean;               // Mark as end node
    maxConnections?: number;       // Max outgoing connections
    category?: string;             // Organization category
  };
  renderNode: (props: NodeRenderProps) => ReactNode;
  renderConfig?: (props: ConfigRenderProps) => ReactNode;
}

interface NodeRenderProps {
  id: string;
  data: Record<string, any>;
  selected: boolean;
}

interface ConfigRenderProps {
  data: Record<string, any>;
  onChange: (data: any) => void;
}
```

**Example - Condition Node:**

```tsx
const conditionNode: FlowNode = {
  type: 'condition',
  title: 'Condition',
  nodeMeta: { category: 'Logic' },
  
  renderNode: ({ data, selected }) => (
    <div style={{ 
      padding: 16, 
      background: selected ? '#e6f7ff' : '#fff',
      border: '1px solid #1890ff',
      borderRadius: 4
    }}>
      <div>If: {data.expression || '(empty)'}</div>
    </div>
  ),
  
  renderConfig: ({ data, onChange }) => (
    <div>
      <label>Expression:</label>
      <input
        value={data.expression || ''}
        onChange={(e) => onChange({ ...data, expression: e.target.value })}
        placeholder="e.g., x > 10"
      />
    </div>
  )
};
```

## 🎯 Advanced Usage

### Connection Validation

```tsx
<FlowEditor
  nodes={nodeTypes}
  value={flowData}
  onChange={setFlowData}
  canAddLine={(source, target) => {
    // Prevent self-connection
    if (source.nodeId === target.nodeId) return false;
    
    // Prevent connecting to start nodes
    const targetNode = findNode(target.nodeId);
    if (targetNode?.data.isStart) return false;
    
    // Prevent cycles
    if (wouldCreateCycle(source, target)) return false;
    
    return true;
  }}
/>
```

### Node Categories

```tsx
function NodePanel() {
  const { nodes, addNode } = useFlowContext();
  
  // Group by category
  const categories = nodes.reduce((acc, node) => {
    const cat = node.nodeMeta?.category || 'Other';
    (acc[cat] = acc[cat] || []).push(node);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(categories).map(([category, categoryNodes]) => (
        <div key={category}>
          <h5>{category}</h5>
          {categoryNodes.map(node => (
            <button key={node.type} onClick={() => addNode(node.type)}>
              {node.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Custom Node Styles

```css
.node-start {
  background: linear-gradient(135deg, #52c41a, #73d13d);
  color: white;
  padding: 16px 24px;
  border-radius: 20px;
  font-weight: bold;
}

.node-action {
  background: #fff;
  border: 2px solid #1890ff;
  border-radius: 8px;
  padding: 12px;
  min-width: 150px;
}

.node-condition {
  background: #fff7e6;
  border: 2px solid #fa8c16;
  border-radius: 4px;
  padding: 12px;
}

.node-end {
  background: #ff4d4f;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 📦 Complete Example

See [playground/antd-demo/src/flow-editor](../../playground/antd-demo/src/flow-editor) for a complete implementation with:
- Multiple node types (Start, Condition, API Call, Set Variable, etc.)
- Node configuration panel
- Connection validation
- Flow execution

---

<a name="简体中文"></a>

# @tangramino/flow-editor

**专业的流程图编辑器**

构建可视化工作流设计器、逻辑编排器和节点式编辑器。适用于业务流程自动化、数据管道和事件驱动架构。

## ✨ 特性

| 特性 | 描述 |
|------|------|
| 🎯 **节点系统** | 定义自定义节点类型 |
| 🔗 **连接控制** | 灵活的端口和连接验证 |
| 🔌 **插件支持** | 通过插件扩展功能 |
| 📊 **状态管理** | 内置流程数据管理 |
| 🎨 **可定制** | 完全控制节点渲染 |
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
    renderNode: () => <div className="node-start">开始</div>
  },
  {
    type: 'action',
    title: '动作',
    renderNode: ({ data }) => <div className="node-action">{data.name || '动作'}</div>,
    renderConfig: ({ data, onChange }) => (
      <input
        value={data.name || ''}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="动作名称"
      />
    )
  }
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

| 属性 | 类型 | 必填 | 描述 |
|------|------|:----:|------|
| `nodes` | `FlowNode[]` | ✓ | 节点类型定义 |
| `value` | `FlowGraphData` | ✓ | 当前流程数据 |
| `onChange` | `(data) => void` | ✓ | 变更回调 |
| `canAddLine` | `(source, target) => boolean` | | 连接验证器 |

### `useFlowContext()`

```typescript
const {
  nodes,           // 节点类型定义
  flowData,        // 当前节点和连线
  selectedNode,    // 选中的节点
  addNode,         // 添加节点
  removeNode,      // 删除节点
  updateNodeData,  // 更新节点数据
} = useFlowContext();
```

### 节点定义

```typescript
interface FlowNode {
  type: string;           // 唯一标识符
  title: string;          // 显示名称
  nodeMeta?: {
    isStart?: boolean;    // 是否为起始节点
    isEnd?: boolean;      // 是否为结束节点
    category?: string;    // 分类
  };
  renderNode: (props) => ReactNode;
  renderConfig?: (props) => ReactNode;
}
```

## 📄 License

MIT
