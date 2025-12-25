# Tangramino

English | [简体中文](./README.zh-CN.md)

<p align="center">
  <strong>A flexible, schema-driven low-code framework for building visual editors and workflow designers.</strong>
</p>

Tangramino provides a complete solution for creating low-code platforms, from schema management to visual editing. With its framework-agnostic engine and modular architecture, you can build drag-and-drop page builders, flow designers, and custom low-code tools with ease.

## ✨ Key Features

- 🎯 **Schema-Driven**: JSONSchema-based architecture for defining UI structure, behavior, and data flow
- 🔌 **Framework Agnostic**: Core engine is UI-framework independent, with official React bindings provided
- 🎨 **Visual Editing**: Production-ready drag-and-drop editor and flow diagram designer
- 🔧 **Plugin System**: Extensible architecture supporting custom plugins and components
- 📦 **Modular**: Composable packages - use the engine alone or build complete editing experiences
- 🛡️ **Type-Safe**: Full TypeScript support with comprehensive type definitions

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
- Package manager: npm, yarn, or pnpm

### Installation

Choose the packages based on your use case:

**Building a drag-and-drop page editor:**

```bash
npm install @tangramino/base-editor
```

**Building a workflow/flow editor:**

```bash
npm install @tangramino/flow-editor
```

**Custom implementation (engine + view layer):**

```bash
# Schema engine (framework-agnostic)
npm install @tangramino/engine

# React view bindings
npm install @tangramino/react
```

### Basic Drag-and-Drop Editor

Create a minimal low-code editor in under 30 lines:

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';
import '@tangramino/base-editor/style';

// Define your component materials
const materials = [
  {
    type: 'button',
    title: 'Button',
    Component: ({ children, ...props }) => <button {...props}>{children}</button>,
    props: { children: 'Click Me' }
  },
  {
    type: 'text',
    title: 'Text',
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

### Render-Only Mode

Use `@tangramino/react` to render schemas without editing capabilities:

```tsx
import React from 'react';
import { View } from '@tangramino/react';
import { createEngine } from '@tangramino/engine';

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

## 💡 Examples & Demos

### Full-Featured Low-Code Editor

Explore our production-ready demo at [`playground/antd-demo`](./playground/antd-demo):

**Features:**
- 🎨 **Material Panel**: Drag-and-drop component library with 25+ Ant Design components
- 🖼️ **Visual Canvas**: Real-time editing with element selection and positioning
- ⚙️ **Property Panel**: Dynamic property configuration for selected elements
- 🔄 **History**: Full undo/redo support
- 💾 **Persistence**: Schema import/export (JSON)
- 📱 **Preview**: Multi-device viewport simulation
- 🧩 **Logic Designer**: Visual workflow editor for complex interactions

**Run locally:**

```bash
git clone https://github.com/keiseiTi/tangramino.git
cd tangramino
pnpm install
pnpm dev:antd  # Open http://localhost:5173
```

### Flow Editor Example

```tsx
import React from 'react';
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import '@tangramino/flow-editor/index.css';

const flowNodes = [
  {
    type: 'start',
    title: 'Start',
    nodeMeta: {
      isStart: true,
      defaultPorts: [{ type: 'output' }]
    },
    renderNode: ({ data }) => <div>{data.title}</div>
  }
];

function FlowApp() {
  const [flowData, setFlowData] = React.useState({ nodes: [], edges: [] });

  return (
    <FlowEditor nodes={flowNodes} value={flowData} onChange={setFlowData}>
      <div style={{ height: '100vh' }}>
        <EditorRenderer />
      </div>
    </FlowEditor>
  );
}
```

## 📖 Documentation

Comprehensive guides and API references are available at [keiseiti.github.io/tangramino](https://keiseiti.github.io/tangramino/)

**Essential Reading:**
- **[Getting Started](https://keiseiti.github.io/tangramino/guide/start/introduce.html)** - Installation and first steps
- **[Schema Concepts](https://keiseiti.github.io/tangramino/guide/concept/schema.html)** - Understanding the data structure
- **[Custom Editors](https://keiseiti.github.io/tangramino/guide/advanced/custom-editor.html)** - Building tailored editing experiences
- **[Plugin Development](https://keiseiti.github.io/tangramino/guide/plugin.html)** - Extending functionality

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
