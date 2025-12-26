# @tangramino/engine

English | [简体中文](./README.zh-CN.md)

---

<a name="english"></a>

**Framework-agnostic JSON Schema engine for low-code platforms**

The foundation of Tangramino — a lightweight, pure TypeScript engine for managing page structures, event handling, and state synchronization. Zero UI dependencies, works with React, Vue, or any frontend framework.

[![npm version](https://img.shields.io/npm/v/@tangramino/engine)](https://www.npmjs.com/package/@tangramino/engine)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@tangramino/engine)](https://bundlephobia.com/package/@tangramino/engine)

## ✨ Features

| Feature                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| 🎯 **Schema-Driven**      | JSON-based page structure definition             |
| 📦 **Framework Agnostic** | Zero UI dependencies — pure data layer           |
| 🔄 **Event System**       | Pub/sub mechanism for state synchronization      |
| 🛡️ **Type-Safe**          | Full TypeScript support with comprehensive types |
| ⚡ **Immutable Updates**  | Built on Immer for efficient state management    |
| 🔧 **Schema Utils**       | Built-in utilities for CRUD operations           |

## 📦 Installation

```bash
npm install @tangramino/engine
```

## 🚀 Quick Start

```typescript
import { createEngine, SchemaUtils } from '@tangramino/engine';

// 1. Define your schema
const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { text: 'Click Me' } },
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] },
  },
};

// 2. Create engine instance
const engine = createEngine(schema);

// 3. Subscribe to changes
engine.on('app', 'ELEMENT_UPDATE', () => {
  console.log('Schema updated:', engine.elements);
});

// 4. Update state
engine.setState({ 'btn-1': { text: 'Updated!' } });
```

## 📖 Core Concepts

### Schema Structure

Schema is a flat JSON structure optimized for efficient lookups:

```typescript
interface Schema {
  // Flat element storage (O(1) access)
  elements: Record<string, ElementState>;
  // Layout tree (parent-child relationships)
  layout: {
    root: string;
    structure: Record<string, string[]>;
  };
  // Flow configuration
  flows?: Flows;
  bindFlowElement?: BindElement[];
  // Schema Context
  context?: { globalVariables?: GlobalVariable[] };
  // Optional extensions
  extensions?: Record<string, unknown>;
}
```

**Example:**

```typescript
const schema = {
  elements: {
    root: { type: 'page', props: { title: 'My App' } },
    header: { type: 'container', props: { className: 'header' } },
    'btn-1': { type: 'button', props: { children: 'Click' } },
  },
  layout: {
    root: 'root',
    structure: {
      root: ['header'],
      header: ['btn-1'],
    },
  },
};
```

### SchemaUtils

Built-in utilities for schema manipulation:

```typescript
import { SchemaUtils } from '@tangramino/engine';

// Insert element
const newSchema = SchemaUtils.insertElement(
  schema,
  'root',
  {
    type: 'input',
    props: { placeholder: 'Enter...' },
  },
  0,
);

// Update props
const updated = SchemaUtils.setElementProps(schema, 'btn-1', {
  text: 'New Text',
});

// Move element
const moved = SchemaUtils.moveElement(schema, 'btn-1', 'header', 0);

// Remove element
const removed = SchemaUtils.removeElement(schema, 'btn-1');

// Get parent chain
const parents = SchemaUtils.getParents(schema, 'btn-1');
// → ['root', 'header']
```

## 🔨 API Reference

### Engine Instance

```typescript
const engine = createEngine(schema);
```

| Method                                 | Description             |
| -------------------------------------- | ----------------------- |
| `engine.elements`                      | Get all elements        |
| `engine.layouts`                       | Get layout structure    |
| `engine.setState(state)`               | Update element props    |
| `engine.getState(id?)`                 | Get element state       |
| `engine.showElements(ids)`             | Show hidden elements    |
| `engine.hiddenElements(ids)`           | Hide elements           |
| `engine.setGlobalVariable(key, value)` | Set global variable     |
| `engine.getGlobalVariable(key)`        | Get global variable     |
| `engine.setExtensions(field, value)`   | Store extension data    |
| `engine.getExtensions(field)`          | Retrieve extension data |

### Event System

```typescript
import { ELEMENT_UPDATE, VIEW_UPDATE } from '@tangramino/engine';

// Subscribe to events
engine.on('myApp', ELEMENT_UPDATE, (data) => {
  console.log('Elements changed:', data);
});

// One-time listener
engine.once('myApp', VIEW_UPDATE, () => {
  console.log('View updated once');
});

// Emit custom events
engine.emit('myApp', 'customEvent', { foo: 'bar' });
```

### Global Variables

```typescript
// Set
engine.setGlobalVariable('userName', 'John');

// Get
const userName = engine.getGlobalVariable('userName');
```

### Callback Injection

Inject dynamic callbacks for runtime behavior:

```typescript
engine.injectCallback('btn-1', 'onClick', () => {
  console.log('Button clicked!');
});
```

## 🔗 Integration

### With React

```tsx
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

const engine = createEngine(schema);

function App() {
  return (
    <ReactView
      engine={engine}
      components={{
        button: MyButton,
        input: MyInput,
        container: MyContainer,
      }}
    />
  );
}
```

### With Base Editor

```tsx
import { createEngine } from '@tangramino/engine';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';

function Editor() {
  return (
    <EditorProvider materials={materials} schema={schema}>
      <CanvasEditor />
    </EditorProvider>
  );
}
```

## 📄 License

MIT
