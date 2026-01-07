# @tangramino/react

[English](./README.md) | 简体中文

---

**Tangramino 引擎的 React 视图层绑定**

将 JSON Schema 渲染为 React 组件树。订阅引擎事件，变更时自动重渲染，支持插件扩展。

## ✨ 特性

| 特性              | 描述                   |
| ----------------- | ---------------------- |
| 🎨 **自动渲染**   | Schema → React 组件树  |
| 🔄 **响应式更新** | 自动订阅引擎事件       |
| 🔌 **插件系统**   | 通过插件扩展渲染功能   |
| 🛡️ **错误边界**   | 内置错误处理           |
| 📦 **类型安全**   | 完整的 TypeScript 支持 |

## 📦 安装

```bash
npm install @tangramino/react @tangramino/engine
```

## 🚀 快速开始

```tsx
import React from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

// 1. 定义 Schema
const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { children: '点击我' } },
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] },
  },
};

// 2. 创建引擎
const engine = createEngine(schema);

// 3. 组件映射
const components = {
  container: ({ children, ...props }) => <div {...props}>{children}</div>,
  button: (props) => <button {...props} />,
};

// 4. 渲染
function App() {
  return <ReactView engine={engine} components={components} />;
}
```

## 📘 API 参考

### `<ReactView />`

| 属性         | 类型                            | 必填 | 描述            |
| ------------ | ------------------------------- | :--: | --------------- |
| `engine`     | `Engine`                        |  ✓   | 引擎实例        |
| `components` | `Record<string, ComponentType>` |  ✓   | 类型 → 组件映射 |
| `plugins`    | `Plugin[]`                      |      | 插件数组        |

### 插件系统

```typescript
const myPlugin: Plugin = (engine) => {
  engine.on('myPlugin', 'ELEMENT_UPDATE', () => {
    console.log('元素已更新');
  });
};
```
