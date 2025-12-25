# @tangramino/flow-editor

**Professional flow diagram editor for React**

Build visual workflow designers, logic orchestrators, and node-based editors. Built on React Flow with a powerful node system and extensible architecture.

## ✨ Features

- **Node System**: Define custom node types with renderers and configuration
- **Connection Control**: Flexible port and connection validation
- **Plugin Support**: Extend functionality with custom plugins
- **State Management**: Built-in state management for nodes and edges
- **Type-Safe**: Full TypeScript support
- **Customizable**: Complete control over node rendering and behavior

## 📦 Installation

```bash
npm install @tangramino/flow-editor
```

> **Peer dependencies:** `react`, `react-dom`, `reactflow`

## 🔨 Quick Start

### Basic Flow Editor

```tsx
import React, { useState } from 'react';
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import '@tangramino/flow-editor/index.css';

// Define node types
const nodes = [
  {
    type: 'start',
    title: 'Start',
    nodeMeta: {
      isStart: true,
      maxConnections: 1,
      defaultPorts: [{ type: 'output', id: 'out' }]
    },
    renderNode: ({ data }) => (
      <div className="node-start">
        <strong>{data.title}</strong>
      </div>
    )
  },
  {
    type: 'action',
    title: 'Action',
    nodeMeta: {
      defaultPorts: [
        { type: 'input', id: 'in' },
        { type: 'output', id: 'out' }
      ]
    },
    renderNode: ({ data }) => (
      <div className="node-action">
        <input 
          value={data.actionName || ''}
          onChange={(e) => data.onChange?.({ actionName: e.target.value })}
          placeholder="Action name"
        />
      </div>
    )
  }
];

function App() {
  const [flowData, setFlowData] = useState({
    nodes: [],
    edges: []
  });

  return (
    <FlowEditor 
      nodes={nodes} 
      value={flowData} 
      onChange={setFlowData}
    >
      <div style={{ height: '100vh' }}>
        <EditorRenderer />
      </div>
    </FlowEditor>
  );
}

export default App;
```

### With Node Panel

```tsx
import { FlowEditor, EditorRenderer, useFlowContext } from '@tangramino/flow-editor';

function NodePanel() {
  const { nodes, addNode } = useFlowContext();

  return (
    <div className="node-panel">
      <h3>Nodes</h3>
      {nodes.map(nodeType => (
        <button
          key={nodeType.type}
          onClick={() => addNode(nodeType.type)}
        >
          {nodeType.title}
        </button>
      ))}
    </div>
  );
}

function App() {
  return (
    <FlowEditor nodes={nodes} value={flowData} onChange={setFlowData}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <aside style={{ width: '200px' }}>
          <NodePanel />
        </aside>
        <main style={{ flex: 1 }}>
          <EditorRenderer />
        </main>
      </div>
    </FlowEditor>
  );
}
```

## 📘 API Reference

### `FlowEditor`

Container component providing flow editor context.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `nodes` | `FlowNode[]` | ✓ | Available node type definitions |
| `value` | `FlowGraphData` | ✓ | Current flow data (nodes & edges) |
| `onChange` | `(data: FlowGraphData) => void` | ✓ | Callback when flow changes |
| `canAddLine` | `(source, target) => boolean` |  | Connection validation function |
| `plugins` | `Plugin[]` |  | Flow editor plugins |

**Example:**

```tsx
<FlowEditor
  nodes={nodeDefinitions}
  value={{ nodes: [], edges: [] }}
  onChange={(newData) => saveFlow(newData)}
  canAddLine={(source, target) => {
    // Prevent cycles
    return !hasCycle(source, target);
  }}
>
  {/* Editor UI */}
</FlowEditor>
```

### `EditorRenderer`

Canvas component for rendering the flow diagram.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `fitView` | `boolean` | Auto-fit view on load |
| `snapToGrid` | `boolean` | Enable grid snapping |

```tsx
<EditorRenderer fitView snapToGrid />
```

### `FlowNode` Definition

Define custom node types:

```typescript
interface FlowNode {
  type: string;                 // Unique node type identifier
  title: string;                // Display name
  nodeMeta: {
    isStart?: boolean;          // Mark as start node
    isEnd?: boolean;            // Mark as end node
    maxConnections?: number;    // Max outgoing connections
    defaultPorts?: Port[];      // Default input/output ports
    category?: string;          // Organization category
  };
  renderNode: (props: NodeRenderProps) => ReactNode;
  renderConfig?: (props: ConfigRenderProps) => ReactNode;
}

interface Port {
  id: string;
  type: 'input' | 'output';
  label?: string;
}

interface NodeRenderProps {
  id: string;
  data: Record<string, any>;
  selected: boolean;
}
```

**Example:**

```tsx
const conditionNode: FlowNode = {
  type: 'condition',
  title: 'Condition',
  nodeMeta: {
    defaultPorts: [
      { id: 'in', type: 'input' },
      { id: 'true', type: 'output', label: 'True' },
      { id: 'false', type: 'output', label: 'False' }
    ]
  },
  renderNode: ({ data, id }) => (
    <div className="condition-node">
      <input
        value={data.expression || ''}
        onChange={(e) => updateNodeData(id, { expression: e.target.value })}
        placeholder="Condition expression"
      />
    </div>
  ),
  renderConfig: ({ data, onChange }) => (
    <div className="config-panel">
      <label>Expression:</label>
      <textarea
        value={data.expression}
        onChange={(e) => onChange({ expression: e.target.value })}
      />
    </div>
  )
};
```

### `useFlowContext`

Hook for accessing flow editor state and methods.

**Returns:**

```typescript
{
  // State
  nodes: FlowNode[];           // Node type definitions
  flowData: FlowGraphData;     // Current nodes & edges
  selectedNode: string | null; // Selected node ID
  
  // Methods
  addNode: (type: string, position?: { x: number, y: number }) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: any) => void;
  addEdge: (source: string, target: string) => void;
  removeEdge: (id: string) => void;
}
```

**Example:**

```tsx
function CustomControls() {
  const { addNode, removeNode, selectedNode } = useFlowContext();

  return (
    <div className="controls">
      <button onClick={() => addNode('start')}>
        Add Start Node
      </button>
      <button 
        onClick={() => selectedNode && removeNode(selectedNode)}
        disabled={!selectedNode}
      >
        Delete Selected
      </button>
    </div>
  );
}
```

## 🎯 Advanced Usage

### Connection Validation

Control which nodes can connect:

```tsx
<FlowEditor
  nodes={nodes}
  value={flowData}
  onChange={setFlowData}
  canAddLine={(source, target) => {
    const sourceNode = findNode(source.nodeId);
    const targetNode = findNode(target.nodeId);
    
    // Prevent connecting start to end directly
    if (sourceNode.type === 'start' && targetNode.type === 'end') {
      return false;
    }
    
    // Prevent cycles
    if (createsCycle(source, target)) {
      return false;
    }
    
    return true;
  }}
/>
```

### Custom Edge Rendering

```tsx
import { BaseEdge } from 'reactflow';

const customEdgeTypes = {
  'custom': ({ id, sourceX, sourceY, targetX, targetY, style }) => (
    <BaseEdge
      id={id}
      path={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
      style={{ ...style, stroke: '#ff0000', strokeWidth: 2 }}
    />
  )
};

// Use in EditorRenderer
<EditorRenderer edgeTypes={customEdgeTypes} />
```

### Node Categories

Organize nodes into categories:

```tsx
const nodes = [
  {
    type: 'http-request',
    title: 'HTTP Request',
    nodeMeta: {
      category: 'API',
      // ...
    }
  },
  {
    type: 'database-query',
    title: 'Database Query',
    nodeMeta: {
      category: 'Database',
      // ...
    }
  }
];

function NodePanel() {
  const { nodes } = useFlowContext();
  const categories = groupBy(nodes, 'nodeMeta.category');

  return (
    <div>
      {Object.entries(categories).map(([category, categoryNodes]) => (
        <div key={category}>
          <h4>{category}</h4>
          {categoryNodes.map(node => (
            <NodeButton key={node.type} node={node} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Data Flow Execution

Execute the flow logic:

```tsx
async function executeFlow(flowData: FlowGraphData) {
  const { nodes, edges } = flowData;
  
  // Find start node
  const startNode = nodes.find(n => n.data.isStart);
  if (!startNode) throw new Error('No start node');
  
  // Execute recursively
  const context = {};
  await executeNode(startNode.id, nodes, edges, context);
}

async function executeNode(nodeId, nodes, edges, context) {
  const node = nodes.find(n => n.id === nodeId);
  
  // Execute node logic based on type
  switch (node.type) {
    case 'http-request':
      context.response = await fetch(node.data.url);
      break;
    case 'condition':
      const result = eval(node.data.expression);
      const nextEdge = edges.find(e => 
        e.source === nodeId && e.sourceHandle === (result ? 'true' : 'false')
      );
      if (nextEdge) {
        await executeNode(nextEdge.target, nodes, edges, context);
      }
      break;
    // ... other node types
  }
}
```

### Plugins

Extend flow editor with plugins:

```tsx
const autoLayoutPlugin: Plugin = {
  name: 'autoLayout',
  apply: (context) => {
    context.registerAction('autoLayout', () => {
      const { nodes, edges } = context.flowData;
      const layoutedNodes = applyDagreLayout(nodes, edges);
      context.updateFlow({ nodes: layoutedNodes, edges });
    });
  }
};

<FlowEditor plugins={[autoLayoutPlugin]} {...props}>
  {/* ... */}
</FlowEditor>
```

## 🎨 Styling

Import default styles:

```tsx
import '@tangramino/flow-editor/index.css';
```

Customize node styles:

```css
.node-start {
  background: #52c41a;
  color: white;
  padding: 16px;
  border-radius: 8px;
}

.node-action {
  background: #1890ff;
  color: white;
  padding: 12px;
  border-radius: 4px;
}

.node-end {
  background: #ff4d4f;
  color: white;
  padding: 16px;
  border-radius: 50%;
}
```

## 📦 Complete Example

See [antd-demo flow-editor](../../playground/antd-demo/src/flow-editor) for a complete implementation with:
- Multiple node types (start, condition, API call, etc.)
- Node configuration panel
- Connection validation
- Flow execution engine
- Save/load functionality

## 📄 License

MIT
