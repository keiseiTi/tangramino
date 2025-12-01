# Tangramino

[English](./README.md) | 简体中文

Tangramino 是一个强大、模块化且基于 Schema 驱动的可视化编辑器框架。它将核心逻辑引擎与视图层分离，从而实现灵活且可扩展的应用程序开发。Tangramino 为构建拖拽界面、流程编辑器以及其他复杂的可视化工具提供了坚实的基础。

## 📦 核心包

| 包名                                                    | 描述                                                     | 版本                                                                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **[`@tangramino/engine`](./packages/engine)**           | 核心 Schema 引擎，负责处理数据、事件和逻辑。与框架无关。 | [![npm](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine)           |
| **[`@tangramino/react`](./packages/react)**             | 引擎的 React 绑定和视图层。                              | [![npm](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react)             |
| **[`@tangramino/base-editor`](./packages/base-editor)** | 基于引擎构建的可视化拖拽编辑器组件。                     | [![npm](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor) |
| **[`@tangramino/flow-editor`](./packages/flow-editor)** | 专业的流程图可视化编辑器组件。                           | [![npm](https://img.shields.io/npm/v/@tangramino/flow-editor)](https://www.npmjs.com/package/@tangramino/flow-editor) |

## ✨ 特性

- **Schema 驱动**：使用强大的 JSONSchema 格式定义应用程序结构和逻辑。
- **框架无关核心**：核心引擎与 UI 解耦，未来可支持 Vue、Angular 或原生 JS。
- **React 集成**：通过 `@tangramino/react` 与 React 无缝集成。
- **可视化编辑**：提供开箱即用的组件，用于构建拖拽和基于节点的流程编辑器。
- **可扩展性**：设计之初就考虑了插件和自定义组件的扩展。
- **TypeScript**：完全使用 TypeScript 编写，提供类型安全和卓越的开发体验。

## 📖 文档

如果您是第一次使用 Tangramino，请查看[入门指南](https://keiseiti.github.io/tangramino/guide/start/introduce.html)，以熟悉Tangramino的架构和使用。

## 🤝 贡献指南

我们需要你的帮助！详情请参阅我们的 [贡献指南](https://keiseiti.github.io/tangramino/guide/contribution.html)。

1.  Fork 本仓库。
2.  创建一个新分支 (`git checkout -b feature/my-feature`)。
3.  提交你的更改 (`git commit -am 'Add some feature'`)。
4.  推送到分支 (`git push origin feature/my-feature`)。
5.  提交 Pull Request。

## 📄 开源协议

[MIT](LICENSE) © Tangramino
