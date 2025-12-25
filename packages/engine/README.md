# @tangramino/engine

**Framework-agnostic schema engine for low-code platforms**

The core of Tangramino - a pure TypeScript engine for managing JSONSchema-based page definitions, event handling, and state management. Use it as the foundation for building visual editors across any UI framework.

## ✨ Features

- **Schema Management**: Complete CRUD operations for elements and layouts
- **Event System**: Powerful pub/sub mechanism for state synchronization
- **Framework Independent**: Zero UI dependencies - pure data layer
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Immutable Updates**: Built on Immer for efficient state management

## 📦 Installation

```bash
npm install @tangramino/engine
```

## 📖 Core Concepts

### Schema Structure

A Schema defines your entire page structure in JSON format:

```typescript
interface Schema {
  // Element definitions (flat structure for efficient lookup)
  elements: Record<string, Element>;
  
  // Layout tree structure
  layout: {
    root: string;                        // Root element ID
    structure: Record<string, string[]>; // Parent -> Children mapping
  };
  
  // Optional metadata and extensions
  meta?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

interface Element {
  id: string;                    // Unique identifier
  type: string;                  // Component type (e.g., 'button', 'input')
  props: Record<string, unknown>; // Component props
  hidden?: boolean;              // Visibility flag
}
```

**Example:**

```typescript
const schema = {
  elements: {
    'root': { id: 'root', type: 'container', props: {} },
    'btn-1': { id: 'btn-1', type: 'button', props: { children: 'Click' } },
    'input-1': { id: 'input-1', type: 'input', props: { placeholder: 'Enter text' } }
  },
  layout: {
    root: 'root',
    structure: {
      'root': ['btn-1', 'input-1']
    }
  }
};
```

### Schema Utilities

The `SchemaUtils` module provides utility functions for manipulating schemas:

```typescript
import { SchemaUtils } from '@tangramino/engine';

// Insert an element
const newSchema = SchemaUtils.insertElement(
  schema,
  parentId,
  newElement,
  position // optional index
);

// Remove an element
const updatedSchema = SchemaUtils.removeElement(schema, elementId);

// Move an element
const movedSchema = SchemaUtils.moveElement(
  schema,
  elementId,
  newParentId,
  newIndex
);

// Update element props
const propsSchema = SchemaUtils.setElementProps(
  schema,
  elementId,
  { children: 'New Text' }
);

// Get parent chain
const parents = SchemaUtils.getParents(schema, elementId);
```

## 🔨 Usage

### Creating an Engine Instance

```typescript
import { createEngine } from '@tangramino/engine';

const engine = createEngine(initialSchema);

// Access current state
const elements = engine.elements;
const layout = engine.layouts;

// Update element state
engine.setState({
  'btn-1': { disabled: true }
});

// Get element state
const btnState = engine.getState('btn-1');

// Show/hide elements
engine.hiddenElements(['btn-1']);
engine.showElements(['btn-1']);
```

### Event System

Subscribe to changes and coordinate updates across your application:

```typescript
import { ELEMENT_UPDATE, VIEW_UPDATE } from '@tangramino/engine';

// Listen to element updates
engine.on('namespace', ELEMENT_UPDATE, () => {
  console.log('Elements changed');
});

// One-time listener
engine.once('namespace', VIEW_UPDATE, () => {
  console.log('View updated once');
});

// Emit custom events
engine.emit('namespace', 'customEvent', data);
```

### Global Variables

Manage global state across your application:

```typescript
// Set a global variable
engine.setGlobalVariable('userName', 'John');

// Get a global variable
const userName = engine.getGlobalVariable('userName');
```

### Extensions

Store custom data in the schema:

```typescript
// Set extension data
engine.setExtensions('myPlugin', { setting: 'value' });

// Get extension data
const pluginData = engine.getExtensions('myPlugin');
```

## 🔗 Integration

The engine is designed to work with view layers. Here's how it integrates with React:

```typescript
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';

const engine = createEngine(schema);

function App() {
  return (
    <ReactView 
      engine={engine}
      components={{
        button: MyButton,
        input: MyInput
      }}
    />
  );
}
```

## 📘 API Reference

### Engine Instance Methods

| Method | Description |
|--------|-------------|
| `setState(state)` | Update element props |
| `getState(id?)` | Get element state (all or specific) |
| `setExtensions(field, value)` | Store extension data |
| `getExtensions(field)` | Retrieve extension data |
| `showElements(ids)` | Show hidden elements |
| `hiddenElements(ids)` | Hide elements |
| `setGlobalVariable(key, value)` | Set global variable |
| `getGlobalVariable(key)` | Get global variable |
| `on(namespace, event, listener)` | Subscribe to events |
| `once(namespace, event, listener)` | Subscribe once |
| `emit(namespace, event, ...args)` | Emit events |

### SchemaUtils Static Methods

| Method | Description |
|--------|-------------|
| `insertElement(schema, parentId, element, index?)` | Insert element into schema |
| `removeElement(schema, elementId)` | Remove element from schema |
| `moveElement(schema, elementId, newParentId, index?)` | Move element to new parent |
| `setElementProps(schema, elementId, props)` | Update element props |
| `getParents(schema, elementId)` | Get parent chain |

## 🔍 Advanced

### Custom Event Namespaces

Organize events by namespace to prevent conflicts:

```typescript
engine.on('myPlugin', 'dataChange', handleDataChange);
engine.emit('myPlugin', 'dataChange', newData);
```

### Callback Injection

Inject callbacks that can be triggered from the schema:

```typescript
engine.injectCallback('btn-1', 'onClick', () => {
  console.log('Button clicked');
});
```

## 📄 License

MIT
