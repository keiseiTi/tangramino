# Tangramino

English | [简体中文](./README.zh-CN.md)

Tangramino is a powerful, modular, and schema-driven visual editor framework. It separates the core logic engine from the view layer, allowing for flexible and scalable application development. Tangramino provides a robust foundation for building drag-and-drop interfaces, flow editors, and other complex visual tools.

## 📦 Packages

| Package                                                 | Description                                                                  | Version                                                                                                               |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **[`@tangramino/engine`](./packages/engine)**           | The core schema engine handling data, events, and logic. Framework-agnostic. | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine)           |
| **[`@tangramino/react`](./packages/react)**             | React bindings and view layer for the engine.                                | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react)             |
| **[`@tangramino/base-editor`](./packages/base-editor)** | A visual drag-and-drop editor component built on top of the engine.          | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| **[`@tangramino/flow-editor`](./packages/flow-editor)** | A specialized visual flow editor component.                                  | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## ✨ Features

- **Schema-Driven**: Define your application structure and logic using a powerful JSONSchema format.
- **Framework Agnostic Core**: The core engine is decoupled from the UI, enabling potential support for Vue, Angular, or vanilla JS in the future.
- **React Integration**: Seamless integration with React via `@tangramino/react`.
- **Visual Editing**: Ready-to-use components for building drag-and-drop and node-based flow editors.
- **Extensible**: Designed with plugins and custom components in mind.
- **TypeScript**: Written in TypeScript for type safety and great developer experience.

## 📖 Documentation

If you are new to Tangramino, please check out the [Getting Started](https://keiseiti.github.io/tangramino/guide/start/introduce.html) guide to familiarize yourself with Tangramino's architecture and usage.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://keiseiti.github.io/tangramino/guide/contribution.html) for details.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/my-feature`).
3.  Commit your changes (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/my-feature`).
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE) © Tangramino
