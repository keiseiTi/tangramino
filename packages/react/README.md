# @tangramino/react

**React bindings for the Tangramino engine**

Connect your Tangramino schema engine to React components with automatic rendering and state synchronization. This package provides the view layer for schema-driven applications.

## ✨ Features

- **Automatic Rendering**: Converts schema to React component tree
- **Real-time Updates**: Subscribes to engine events and re-renders on changes
- **Plugin System**: Extend rendering with custom plugins
- **HOC Support**: Wrap components with error boundaries, data injection, etc.
- **Type-Safe**: Full TypeScript support

## 📦 Installation

```bash
npm install @tangramino/react @tangramino/engine
```

> **Note:** `@tangramino/engine` is a peer dependency

## 🔨 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';
import { Button, Input } from 'antd';

// 1. Define your schema
const schema = {
  elements: {
    'root': { id: 'root', type: 'container', props: {} },
    'btn-1': { id: 'btn-1', type: 'button', props: { children: 'Click Me', type: 'primary' } },
    'input-1': { id: 'input-1', type: 'input', props: { placeholder: 'Enter text' } }
  },
  layout: {
    root: 'root',
    structure: { 'root': ['btn-1', 'input-1'] }
  }
};

// 2. Create engine instance
const engine = createEngine(schema);

// 3. Map component types to React components
const components = {
  container: ({ children }) => <div className="container">{children}</div>,
  button: Button,
  input: Input
};

// 4. Render
function App() {
  return <ReactView engine={engine} components={components} />;
}

export default App;
```

### With Plugins

Plugins can enhance rendering behavior:

```tsx
import { ReactView } from '@tangramino/react';
import type { Plugin } from '@tangramino/react';

// Define a custom plugin
const loggerPlugin: Plugin = (engine) => {
  engine.on('plugin', 'ELEMENT_UPDATE', () => {
    console.log('Elements updated:', engine.elements);
  });
};

function App() {
  return (
    <ReactView 
      engine={engine} 
      components={components}
      plugins={[loggerPlugin]}
    />
  );
}
```

## 📘 API Reference

### `ReactView`

Main component for rendering schemas.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `engine` | `Engine` | ✓ | Engine instance from `createEngine()` |
| `components` | `Record<string, ComponentType>` | ✓ | Mapping of component types to React components |
| `plugins` | `Plugin[]` |  | Array of plugins to extend functionality |

**Example:**

```tsx
<ReactView
  engine={engine}
  components={{
    button: MyButton,
    input: MyInput,
    container: MyContainer
  }}
  plugins={[myPlugin]}
/>
```

### Plugin API

Plugins are functions that receive the engine instance and can subscribe to events or modify behavior:

```typescript
type Plugin = (engine: Engine) => void;

// Example plugin
const myPlugin: Plugin = (engine) => {
  // Subscribe to events
  engine.on('myPlugin', 'ELEMENT_UPDATE', () => {
    // Handle update
  });
  
  // Modify engine state
  engine.setExtensions('myPlugin', { active: true });
};
```

### Higher-Order Component (HOC)

Wrap your components with additional functionality:

```tsx
import { HocComponent } from '@tangramino/react';

// Define HOC wrapper
const withErrorBoundary = (Component) => (props) => (
  <ErrorBoundary>
    <Component {...props} />
  </ErrorBoundary>
);

// Use in ReactView
<ReactView
  engine={engine}
  components={{
    button: HocComponent(Button, [withErrorBoundary])
  }}
/>
```

## 🎯 Advanced Usage

### Dynamic Component Registration

Register components at runtime:

```tsx
function App() {
  const [components, setComponents] = React.useState({
    button: Button
  });

  const registerNewComponent = (type, Component) => {
    setComponents(prev => ({ ...prev, [type]: Component }));
  };

  return <ReactView engine={engine} components={components} />;
}
```

### Custom Rendering Logic

Override default rendering for specific components:

```tsx
const CustomRenderer = ({ element, children, engine }) => {
  // Access element data
  const { type, props, id } = element;
  
  // Custom rendering logic
  if (type === 'special') {
    return <SpecialComponent {...props}>{children}</SpecialComponent>;
  }
  
  // Default rendering
  return children;
};
```

### State Synchronization

Update engine state from React:

```tsx
function InteractiveButton({ elementId, engine }) {
  const handleClick = () => {
    // Update element state
    engine.setState({
      [elementId]: { clicked: true }
    });
  };

  return (
    <ReactView engine={engine} components={components} />
  );
}
```

## 🔄 Event Handling

Subscribe to engine events for real-time updates:

```tsx
import { ELEMENT_UPDATE, VIEW_UPDATE } from '@tangramino/engine';

function MyComponent({ engine }) {
  React.useEffect(() => {
    const handleUpdate = () => {
      console.log('Elements updated');
    };

    engine.on('myComponent', ELEMENT_UPDATE, handleUpdate);

    return () => {
      // Cleanup if needed
    };
  }, [engine]);

  return <ReactView engine={engine} components={components} />;
}
```

## 🎨 Styling

Apply styles to rendered elements:

```tsx
const components = {
  button: (props) => (
    <button 
      {...props}
      style={{
        ...props.style,
        padding: '8px 16px',
        borderRadius: '4px'
      }}
    />
  )
};
```

## 🐛 Error Handling

Built-in error boundary for component rendering:

```tsx
import { ErrorBoundary } from '@tangramino/react';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ReactView engine={engine} components={components} />
    </ErrorBoundary>
  );
}
```

## 🔗 Integration Examples

### With @tangramino/base-editor

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

### With State Management

```tsx
function App() {
  const engine = React.useMemo(() => createEngine(schema), []);
  
  // Sync with external state
  React.useEffect(() => {
    engine.on('app', 'ELEMENT_UPDATE', () => {
      // Update external state
      updateStore(engine.getState());
    });
  }, [engine]);

  return <ReactView engine={engine} components={components} />;
}
```

## 📄 License

MIT
