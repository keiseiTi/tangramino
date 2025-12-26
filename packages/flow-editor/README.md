# @tangramino/flow-editor

English | [简体中文](./README.zh-CN.md)

---

<a name="english"></a>

**Professional flow diagram editor for workflow design**

Build visual workflow designers, logic orchestrators, and node-based editors. Perfect for business process automation, data pipelines, and event-driven architectures.

[![npm version](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor)

## ✨ Features

| Feature                   | Description                             |
| ------------------------- | --------------------------------------- |
| 🎯 **Node System**        | Define custom node types with renderers |
| 🔗 **Connection Control** | Flexible port and connection validation |
| 🔌 **Plugin Support**     | Extend with custom plugins              |
| 📊 **State Management**   | Built-in flow data management           |
| 🎨 **Customizable**       | Complete control over node rendering    |
| 🛡️ **Type-Safe**          | Full TypeScript support                 |

## 📦 Installation

```bash
npm install @tangramino/flow-editor
```

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
    ),
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
        <input value={data.name || ''} onChange={(e) => onChange({ name: e.target.value })} />
      </div>
    ),
  },
  {
    type: 'end',
    title: 'End',
    nodeMeta: { isEnd: true },
    renderNode: () => (
      <div style={{ padding: 16, background: '#ff4d4f', color: '#fff', borderRadius: '50%' }}>
        End
      </div>
    ),
  },
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
      {nodes.map((node) => (
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

  const nodeType = nodes.find((n) => n.type === selectedNode.type);
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

| Prop         | Type                          | Required | Description           |
| ------------ | ----------------------------- | :------: | --------------------- |
| `nodes`      | `FlowNode[]`                  |    ✓     | Node type definitions |
| `value`      | `FlowGraphData`               |    ✓     | Current flow data     |
| `onChange`   | `(data) => void`              |    ✓     | Change callback       |
| `canAddLine` | `(source, target) => boolean` |          | Connection validator  |
| `plugins`    | `Plugin[]`                    |          | Flow editor plugins   |

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

## 📦 Complete Example

See [playground/antd-demo/src/flow-editor](../../playground/antd-demo/src/flow-editor) for a complete implementation with:

- Multiple node types (Start, Condition, API Call, Set Variable, etc.)
- Node configuration panel
- Connection validation
- Flow execution

## 📄 License

MIT
