# Tangramino

English | [简体中文](./README.zh-CN.md)

<p align="center">
  <strong>A flexible, schema-driven low-code framework for building visual editors and workflow designers.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@tangramino/engine"><img src="https://img.shields.io/npm/v/@tangramino/engine" alt="npm version" /></a>
  <a href="https://github.com/keiseiTi/tangramino/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@tangramino/engine" alt="license" /></a>
</p>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Schema-Driven** | JSON-based architecture for UI structure, behavior, and data flow |
| 🔌 **Framework Agnostic** | Core engine is UI-independent, with React bindings provided |
| 🎨 **Visual Editing** | Production-ready drag-and-drop editor and flow designer |
| 🔧 **Plugin System** | Extensible architecture for custom plugins |
| 📦 **Modular** | Use engine alone or build complete editing experiences |
| 🛡️ **Type-Safe** | Full TypeScript support |

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@tangramino/engine`](./packages/engine) | Framework-agnostic JSON Schema engine | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine) |
| [`@tangramino/react`](./packages/react) | React bindings with hooks and view rendering | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react) |
| [`@tangramino/base-editor`](./packages/base-editor) | Visual drag-and-drop editor framework | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| [`@tangramino/flow-editor`](./packages/flow-editor) | Professional flow diagram editor | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## 🎯 Which Package Should I Use?

| Your Goal | Recommended Package |
|-----------|---------------------|
| Render schema to React components | `@tangramino/react` |
| Build a drag-and-drop page editor | `@tangramino/base-editor` |
| Build a workflow/flow designer | `@tangramino/flow-editor` |
| Custom implementation with full control | `@tangramino/engine` + `@tangramino/react` |
| Learn from a complete example | [playground/antd-demo](./playground/antd-demo) |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Editor Layer (@tangramino/base-editor, flow-editor)   │
│  • Drag & Drop  • Material System  • Canvas & Selection│
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│         View Layer (@tangramino/react)                  │
│  • Component Rendering  • Hooks & HOC  • Event Binding │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│         Engine Layer (@tangramino/engine)               │
│  • Schema Management  • Event System  • State Control  │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Drag-and-Drop Editor (30 lines)

```bash
npm install @tangramino/base-editor
```

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor, Draggable, useEditorCore } from '@tangramino/base-editor';

const materials = [
  {
    type: 'button',
    title: 'Button',
    Component: (props) => <button {...props}>{props.children || 'Click'}</button>,
    defaultProps: { children: 'Button' }
  }
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
      {materials.map(m => (
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

### Render-Only Mode

```tsx
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { children: 'Click Me' } }
  },
  layout: { root: 'root', structure: { root: ['btn-1'] } }
};

const engine = createEngine(schema);

function App() {
  return (
    <ReactView 
      engine={engine} 
      components={{
        container: ({ children }) => <div>{children}</div>,
        button: (props) => <button {...props} />
      }} 
    />
  );
}
```

### Flow Editor

```tsx
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';

const nodeTypes = [
  {
    type: 'start',
    title: 'Start',
    renderNode: () => <div className="node-start">Start</div>
  },
  {
    type: 'action',
    title: 'Action',
    renderNode: ({ data }) => <div className="node-action">{data.name || 'Action'}</div>
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

## 💡 Demo

Explore our production-ready demo with 25+ Ant Design components:

```bash
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino
pnpm install
pnpm dev:antd  # http://localhost:5173
```

**Features:** Material Panel • Visual Canvas • Property Editor • Undo/Redo • Schema Export • Preview • Flow Designer

## 📖 Documentation

- **[Getting Started](https://keiseiti.github.io/tangramino/guide/start/introduce.html)**
- **[Schema Concepts](https://keiseiti.github.io/tangramino/guide/concept/schema.html)**
- **[Material System](https://keiseiti.github.io/tangramino/guide/concept/material.html)**
- **[Plugin Development](https://keiseiti.github.io/tangramino/guide/concept/plugin.html)**
- **[API Reference](https://keiseiti.github.io/tangramino/api/engine.html)**

## 🛠️ Development

```bash
pnpm install     # Install dependencies
pnpm watch       # Watch mode
pnpm dev:antd    # Run demo
pnpm build       # Build all packages
pnpm test        # Run tests
```

## 🤝 Contributing

We welcome contributions! See [Contributing Guide](./contribution.md).

## 📄 License

[MIT](LICENSE) © Tangramino
