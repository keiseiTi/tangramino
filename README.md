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

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn or pnpm

### Installation

You can install the core packages individually based on your needs:

```bash
npm install @tangramino/engine @tangramino/react
```

If you are building a visual editor:

```bash
npm install @tangramino/base-editor
```

### Usage Example

Check out the [playground/antd-demo](./playground/antd-demo) for a complete example of how to build a low-code editor using Tangramino.

## 📖 Documentation

Visit our [documentation site](https://keiseiti.github.io/tangramino/) for detailed guides and API references.

- [Introduction](https://keiseiti.github.io/tangramino/guide/start/introduce.html)
- [Custom Editor Guide](./site/docs/guide/advanced/custom-editor.md)
- [Flow Editor Guide](./site/docs/guide/advanced/custom-flow-editor.md)
- [Plugin Development](./site/docs/guide/plugin.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./site/docs/contribution.md) for details.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/my-feature`).
3.  Commit your changes (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/my-feature`).
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE) © Tangramino
