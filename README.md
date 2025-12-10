# Tangramino

English | [简体中文](./README.zh-CN.md)

A modular, schema-driven visual editor framework for building low-code platforms, drag-and-drop interfaces, and flow editors. Tangramino separates the core logic engine from the view layer, providing maximum flexibility and extensibility.

## ✨ Key Features

- 🎯 **Schema-Driven Architecture**: Define UI structure and logic using powerful JSONSchema format
- 🔌 **Framework Agnostic Core**: Engine layer is completely decoupled from UI frameworks, theoretically adaptable to React, Vue, Svelte, and more
- 🎨 **Visual Editors**: Ready-to-use drag-and-drop and flow diagram editors
- 🔧 **Highly Extensible**: Plugin system and custom component support
- 📦 **Modular Design**: Use only what you need - from engine to complete editors
- 🛡️ **Type Safety**: Written in TypeScript with comprehensive type definitions

## 📦 Core Packages

| Package | Description | Version |
| --- | --- | --- |
| **[`@tangramino/engine`](./packages/engine)** | Framework-agnostic core engine for schema management, event handling, and data operations | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine) |
| **[`@tangramino/react`](./packages/react)** | React bindings for the engine with hooks, HOC, and view rendering capabilities | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react) |
| **[`@tangramino/base-editor`](./packages/base-editor)** | Visual drag-and-drop editor with material system, canvas management, and dnd-kit integration | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| **[`@tangramino/flow-editor`](./packages/flow-editor)** | Professional flow diagram editor for workflow design and logic orchestration | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## 🏗️ Architecture

Tangramino follows a clean layered architecture that promotes separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│  Editor Layer (@tangramino/base-editor, flow-editor)   │
│  - Drag & Drop UI                                        │
│  - Material Management                                   │
│  - Canvas & Selection                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         View Layer (@tangramino/react)                   │
│  - React Component Tree Rendering                        │
│  - Hooks & HOC                                           │
│  - Event Listeners                                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Engine Layer (@tangramino/engine)                │
│  - JSONSchema Management                                 │
│  - Element CRUD Operations                               │
│  - Event System                                          │
│  - Framework Agnostic                                    │
└─────────────────────────────────────────────────────────┘
```

**Layers:**

1. **Engine Layer** (`@tangramino/engine`): Manages JSONSchema, handles events, and provides APIs for data manipulation. Completely UI-agnostic.
2. **View Layer** (`@tangramino/react`): Binds the engine to React, listens to engine events, and renders the component tree based on schema.
3. **Editor Layer** (`@tangramino/base-editor`, `@tangramino/flow-editor`): Provides complete editing experiences with drag-and-drop, selection, property panels, and more.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16
- npm, yarn, or pnpm

### Installation

**For a complete drag-and-drop editor:**

```bash
npm install @tangramino/base-editor
# or
pnpm add @tangramino/base-editor
```

**For a flow diagram editor:**

```bash
npm install @tangramino/flow-editor
# or
pnpm add @tangramino/flow-editor
```

**For custom integrations:**

```bash
# Framework-agnostic engine only
npm install @tangramino/engine

# React bindings
npm install @tangramino/react
```

### Basic Drag-and-Drop Editor

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';
import '@tangramino/base-editor/style';

// 1. Define your materials (components available in the editor)
const materials = [
  {
    type: 'button',
    title: 'Button',
    Component: ({ children, ...props }) => <button {...props}>{children}</button>,
    props: { 
      children: 'Click Me',
      type: 'primary'
    }
  },
  {
    type: 'text',
    title: 'Text',
    Component: ({ content }) => <p>{content}</p>,
    props: { 
      content: 'Hello World' 
    }
  }
];

// 2. Create the Editor
function App() {
  return (
    <EditorProvider materials={materials}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '16px', background: '#f0f0f0' }}>
          <h1>My Low-Code Editor</h1>
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

### Basic Schema Rendering

If you only need to render a schema without editing:

```tsx
import React from 'react';
import { View } from '@tangramino/react';

const schema = {
  elements: {
    'btn-1': { 
      id: 'btn-1', 
      type: 'button', 
      props: { children: 'Click Me' } 
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

## 💡 Examples

### Complete Low-Code Editor

Check out our comprehensive demo in [`playground/antd-demo`](./playground/antd-demo) which includes:

- 🎨 Material panel with drag-and-drop
- 🖼️ Visual canvas with element selection
- ⚙️ Property configuration panel
- 🔄 Undo/redo support
- 💾 Schema export/import
- 📱 Preview mode
- 🎯 Integration with Ant Design components

**Run the demo:**

```bash
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino
pnpm install
pnpm dev:antd
```

### Flow Editor

```tsx
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import '@tangramino/flow-editor/index.css';

const flowNodes = [
  {
    type: 'start',
    title: 'Start Node',
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

## 📖 Documentation

Visit our comprehensive [documentation site](https://keiseiti.github.io/tangramino/) for:

- [Quick Start Guide](https://keiseiti.github.io/tangramino/guide/start/introduce.html)
- [Core Concepts](https://keiseiti.github.io/tangramino/guide/concept/schema.html)
- [Advanced Topics](https://keiseiti.github.io/tangramino/guide/advanced/custom-editor.html)
- [Plugin Development](https://keiseiti.github.io/tangramino/guide/plugin.html)

## 🎯 Use Cases

- **Low-Code Platforms**: Build drag-and-drop page builders
- **Form Builders**: Create dynamic form designers
- **Workflow Engines**: Design visual workflow and automation tools
- **Dashboard Builders**: Construct customizable dashboard creators
- **Mobile App Builders**: Create mobile UI designers

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino

# Install dependencies
pnpm install

# Watch all packages in development mode
pnpm watch

# Run the demo
pnpm dev:antd

# Build all packages
pnpm build

# Run documentation site
pnpm site
```

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions

Please see our [Contributing Guide](./site/docs/contribution.md) for detailed information on:

- Setting up the development environment
- Code style and conventions
- Submitting pull requests
- Running tests

## 📄 License

[MIT](LICENSE) © Tangramino

---

Made with ❤️ by the Tangramino team
