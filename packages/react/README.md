# @tangramino/react

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>

**React view layer bindings for Tangramino engine**

Render your JSON Schema to React components automatically. Subscribe to engine events, re-render on changes, and extend with plugins.

[![npm version](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Auto Rendering** | Schema → React component tree |
| 🔄 **Reactive Updates** | Subscribes to engine events automatically |
| 🔌 **Plugin System** | Extend rendering with custom plugins |
| 🛡️ **Error Boundary** | Built-in error handling |
| 📦 **Type-Safe** | Full TypeScript support |

## 📦 Installation

```bash
npm install @tangramino/react @tangramino/engine
```

> **Note:** `@tangramino/engine` is a peer dependency

## 🚀 Quick Start

```tsx
import React from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

// 1. Define schema
const schema = {
  elements: {
    root: { type: 'container', props: { className: 'app' } },
    'btn-1': { type: 'button', props: { children: 'Click Me' } }
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] }
  }
};

// 2. Create engine
const engine = createEngine(schema);

// 3. Map component types
const components = {
  container: ({ children, ...props }) => <div {...props}>{children}</div>,
  button: (props) => <button {...props} />
};

// 4. Render
function App() {
  return <ReactView engine={engine} components={components} />;
}
```

## 📘 API Reference

### `<ReactView />`

Main component for rendering schemas.

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `engine` | `Engine` | ✓ | Engine instance from `createEngine()` |
| `components` | `Record<string, ComponentType>` | ✓ | Type → Component mapping |
| `plugins` | `Plugin[]` | | Array of plugins |

```tsx
<ReactView
  engine={engine}
  components={{
    button: Button,
    input: Input,
    container: Container
  }}
  plugins={[loggerPlugin]}
/>
```

### Plugin System

Plugins receive the engine instance and can subscribe to events:

```typescript
import type { Plugin } from '@tangramino/react';

const loggerPlugin: Plugin = (engine) => {
  engine.on('logger', 'ELEMENT_UPDATE', () => {
    console.log('Elements updated:', engine.elements);
  });
};

// Usage
<ReactView 
  engine={engine} 
  components={components}
  plugins={[loggerPlugin]}
/>
```

### HOC (Higher-Order Component)

Wrap components with additional functionality:

```tsx
import { HocComponent } from '@tangramino/react';

const withErrorBoundary = (Component) => (props) => (
  <ErrorBoundary fallback={<div>Error</div>}>
    <Component {...props} />
  </ErrorBoundary>
);

// Usage
<ReactView
  engine={engine}
  components={{
    button: HocComponent(Button, [withErrorBoundary])
  }}
/>
```

### Error Boundary

Built-in error boundary for safe rendering:

```tsx
import { ErrorBoundary } from '@tangramino/react';

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <ReactView engine={engine} components={components} />
</ErrorBoundary>
```

## 🎯 Advanced Usage

### Event Subscription

Subscribe to engine events in React components:

```tsx
import { ELEMENT_UPDATE } from '@tangramino/engine';

function MyComponent({ engine }) {
  React.useEffect(() => {
    const handler = () => console.log('Updated!');
    engine.on('myComponent', ELEMENT_UPDATE, handler);
    
    return () => {
      // Cleanup if needed
    };
  }, [engine]);

  return <ReactView engine={engine} components={components} />;
}
```

### State Synchronization

Update engine state from React:

```tsx
function InteractiveButton({ engine, elementId }) {
  const handleClick = () => {
    engine.setState({
      [elementId]: { clicked: true, timestamp: Date.now() }
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Dynamic Component Registration

```tsx
function App() {
  const [components, setComponents] = React.useState({
    button: Button
  });

  const registerComponent = (type, Component) => {
    setComponents(prev => ({ ...prev, [type]: Component }));
  };

  return <ReactView engine={engine} components={components} />;
}
```

## 🔗 Integration

### With Ant Design

```tsx
import { Button, Input, Card } from 'antd';

const components = {
  button: Button,
  input: Input,
  card: Card,
  container: ({ children, ...props }) => <div {...props}>{children}</div>
};
```

### With Base Editor

```tsx
import { EditorProvider } from '@tangramino/base-editor';
import { ReactView } from '@tangramino/react';

function Editor() {
  return (
    <EditorProvider materials={materials}>
      {({ engine }) => (
        <ReactView engine={engine} components={components} />
      )}
    </EditorProvider>
  );
}
```

---

<a name="简体中文"></a>

# @tangramino/react

**Tangramino 引擎的 React 视图层绑定**

自动将 JSON Schema 渲染为 React 组件树。订阅引擎事件，变更时自动重渲染，支持插件扩展。

## ✨ 特性

| 特性 | 描述 |
|------|------|
| 🎨 **自动渲染** | Schema → React 组件树 |
| 🔄 **响应式更新** | 自动订阅引擎事件 |
| 🔌 **插件系统** | 通过插件扩展渲染功能 |
| 🛡️ **错误边界** | 内置错误处理 |
| 📦 **类型安全** | 完整的 TypeScript 支持 |

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
    'btn-1': { type: 'button', props: { children: '点击我' } }
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] }
  }
};

// 2. 创建引擎
const engine = createEngine(schema);

// 3. 组件映射
const components = {
  container: ({ children, ...props }) => <div {...props}>{children}</div>,
  button: (props) => <button {...props} />
};

// 4. 渲染
function App() {
  return <ReactView engine={engine} components={components} />;
}
```

## 📘 API 参考

### `<ReactView />`

| 属性 | 类型 | 必填 | 描述 |
|------|------|:----:|------|
| `engine` | `Engine` | ✓ | 引擎实例 |
| `components` | `Record<string, ComponentType>` | ✓ | 类型 → 组件映射 |
| `plugins` | `Plugin[]` | | 插件数组 |

### 插件系统

```typescript
const myPlugin: Plugin = (engine) => {
  engine.on('myPlugin', 'ELEMENT_UPDATE', () => {
    console.log('元素已更新');
  });
};
```

### 高阶组件 (HOC)

```tsx
import { HocComponent } from '@tangramino/react';

const withWrapper = (Component) => (props) => (
  <div className="wrapper">
    <Component {...props} />
  </div>
);

// 使用
components: {
  button: HocComponent(Button, [withWrapper])
}
```

## 📄 License

MIT
