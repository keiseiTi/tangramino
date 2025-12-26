# @tangramino/react

English | [简体中文](./README.zh-CN.md)

---

<a name="english"></a>

**React view layer bindings for Tangramino engine**

Render your JSON Schema to React components automatically. Subscribe to engine events, re-render on changes, and extend with plugins.

[![npm version](https://img.shields.io/npm/v/@tangramino/react)](https://www.npmjs.com/package/@tangramino/react)

## ✨ Features

| Feature                 | Description                               |
| ----------------------- | ----------------------------------------- |
| 🎨 **Auto Rendering**   | Schema → React component tree             |
| 🔄 **Reactive Updates** | Subscribes to engine events automatically |
| 🔌 **Plugin System**    | Extend rendering with custom plugins      |
| 🛡️ **Error Boundary**   | Built-in error handling                   |
| 📦 **Type-Safe**        | Full TypeScript support                   |

## 📦 Installation

```bash
npm install @tangramino/react @tangramino/engine
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

// 1. Define schema
const schema = {
  elements: {
    root: { type: 'container', props: { className: 'app' } },
    'btn-1': { type: 'button', props: { children: 'Click Me' } },
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] },
  },
};

// 2. Create engine
const engine = createEngine(schema);

// 3. Map component types
const components = {
  container: ({ children, ...props }) => <div {...props}>{children}</div>,
  button: (props) => <button {...props} />,
};

// 4. Render
function App() {
  return <ReactView engine={engine} components={components} />;
}
```

## 📘 API Reference

### `<ReactView />`

Main component for rendering schemas.

| Prop         | Type                            | Required | Description                           |
| ------------ | ------------------------------- | :------: | ------------------------------------- |
| `engine`     | `Engine`                        |    ✓     | Engine instance from `createEngine()` |
| `components` | `Record<string, ComponentType>` |    ✓     | Type → Component mapping              |
| `plugins`    | `Plugin[]`                      |          | Array of plugins                      |

```tsx
<ReactView
  engine={engine}
  components={{
    button: Button,
    input: Input,
    container: Container,
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

## 📄 License

MIT
