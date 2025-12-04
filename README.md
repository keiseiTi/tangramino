# Tangramino

English | [简体中文](./README.zh-CN.md)

Tangramino is a powerful, modular, and schema-driven visual editor framework. It separates the core logic engine from the view layer, allowing for flexible and scalable application development. Tangramino provides a robust foundation for building drag-and-drop interfaces, flow editors, and other complex visual tools.

## 📦 Packages

| Package | Description | Version |
| --- | --- | --- |
| **[`@tangramino/engine`](./packages/engine)** | The core schema engine handling data, events, and logic. Framework-agnostic. | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine) |
| **[`@tangramino/react`](./packages/react)** | React bindings and view layer for the engine. | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react) |
| **[`@tangramino/base-editor`](./packages/base-editor)** | A visual drag-and-drop editor component built on top of the engine. | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| **[`@tangramino/flow-editor`](./packages/flow-editor)** | A specialized visual flow editor component. | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## ✨ Features

- **Schema-Driven**: Define your application structure and logic using a powerful JSONSchema format.
- **Framework Agnostic Core**: The core engine is decoupled from the UI, enabling potential support for Vue, Angular, or vanilla JS in the future.
- **React Integration**: Seamless integration with React via `@tangramino/react`.
- **Visual Editing**: Ready-to-use components for building drag-and-drop and node-based flow editors.
- **Extensible**: Designed with plugins and custom components in mind.
- **TypeScript**: Written in TypeScript for type safety and great developer experience.

## 🏗 Architecture

Tangramino is built with a layered architecture:

1.  **Engine Layer (`@tangramino/engine`)**: Manages the JSONSchema, handles events, and provides APIs for manipulating the document structure. It knows nothing about the UI.
2.  **View Layer (`@tangramino/react`)**: Binds the Engine to React. It listens to Engine events and renders the React component tree based on the Schema.
3.  **Editor Layer (`@tangramino/base-editor`, `@tangramino/flow-editor`)**: Provides the UI components for editing, such as drag-and-drop handlers, selection tools, and canvas management.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm, yarn, or pnpm

### Installation

To build a drag-and-drop editor, install the base editor package (which includes engine and react bindings):

```bash
npm install @tangramino/base-editor
```

### Basic Usage

Here is a minimal example of how to set up an editor:

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';

// 1. Define your materials (components available in the editor)
const materials = [
  {
    type: 'button',
    title: 'Button',
    Component: ({ children }) => <button>{children}</button>,
    props: { children: 'Click Me' }
  }
];

// 2. Create the Editor
const App = () => {
  return (
    <EditorProvider materials={materials}>
      <div style={{ height: '100vh', padding: 20 }}>
        <h1>My Editor</h1>
        <CanvasEditor />
      </div>
    </EditorProvider>
  );
};

export default App;
```

For a complete example with drag-and-drop sidebar, property panels, and more, check out the [playground/antd-demo](./playground/antd-demo).

## 📖 Documentation

Visit our [documentation site](https://keiseiti.github.io/tangramino/) for detailed guides and API references.

- [Introduction](https://keiseiti.github.io/tangramino/guide/start/introduce.html)
- [Custom Editor Guide](./site/docs/guide/advanced/custom-editor.md)
- [Flow Editor Guide](./site/docs/guide/advanced/custom-flow-editor.md)
- [Plugin Development](./site/docs/guide/plugin.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./site/docs/contribution.md) for details on how to set up the development environment and submit Pull Requests.

## 📄 License

[MIT](LICENSE) © Tangramino
