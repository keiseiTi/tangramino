# @tangramino/base-editor

English | [简体中文](./README.zh-CN.md)

---

<a name="english"></a>

**Production-ready drag-and-drop visual editor framework**

Build powerful low-code editors with drag-and-drop, canvas management, material system, and plugin architecture. Built on `dnd-kit` for smooth interactions.

[![npm version](https://img.shields.io/npm/v/@tangramino/base-editor)](https://www.npmjs.com/package/@tangramino/base-editor)

## ✨ Features

| Feature                    | Description                         |
| -------------------------- | ----------------------------------- |
| 🎯 **Drag & Drop**         | Built-in dnd-kit integration        |
| 🎨 **Material System**     | Define reusable component materials |
| 🔌 **Plugin Architecture** | Extend with custom plugins          |
| 📜 **History Support**     | Built-in undo/redo capability       |
| 🖼️ **Canvas Management**   | Selection, positioning, overlays    |
| 🛡️ **Type-Safe**           | Full TypeScript support             |

## 📦 Installation

```bash
npm install @tangramino/base-editor
```

## 🚀 Quick Start

### Minimal Editor

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor, Draggable, useEditorCore } from '@tangramino/base-editor';

const materials = [
  {
    type: 'button',
    title: 'Button',
    Component: (props) => <button {...props}>{props.children || 'Click'}</button>,
    defaultProps: { children: 'Button' },
  },
];

function App() {
  return (
    <EditorProvider materials={materials}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <MaterialPanel />
        <CanvasEditor style={{ flex: 1 }} />
      </div>
    </EditorProvider>
  );
}

function MaterialPanel() {
  const { materials } = useEditorCore();
  return (
    <div style={{ width: 200, padding: 16 }}>
      {materials.map((m) => (
        <Draggable key={m.type} material={m}>
          <div style={{ padding: 8, border: '1px solid #ddd', marginBottom: 8, cursor: 'move' }}>
            {m.title}
          </div>
        </Draggable>
      ))}
    </div>
  );
}
```

### Complete Editor

```tsx
import React, { useState } from 'react';
import {
  EditorProvider,
  CanvasEditor,
  DragOverlay,
  Draggable,
  useEditorCore,
  historyPlugin,
} from '@tangramino/base-editor';

// Materials
const materials = [
  {
    type: 'container',
    title: 'Container',
    isContainer: true,
    Component: ({ children, ...props }) => <div {...props}>{children}</div>,
    defaultProps: { style: { padding: 16, border: '1px dashed #ccc', minHeight: 100 } },
  },
  {
    type: 'button',
    title: 'Button',
    Component: (props) => <button {...props}>{props.children}</button>,
    defaultProps: { children: 'Click Me' },
    editorConfig: {
      panels: [
        {
          title: 'Props',
          configs: [{ field: 'children', label: 'Text', uiType: 'input' }],
        },
      ],
    },
  },
];

// Property Panel
function PropertyPanel() {
  const { activeId, schema, updateElement } = useEditorCore();
  const element = activeId ? schema.elements[activeId] : null;

  if (!element) return <div style={{ padding: 16 }}>Select an element</div>;

  return (
    <div style={{ width: 250, padding: 16, borderLeft: '1px solid #ddd' }}>
      <h4>Properties</h4>
      <label>Text:</label>
      <input
        value={element.props.children || ''}
        onChange={(e) =>
          updateElement(activeId, {
            props: { ...element.props, children: e.target.value },
          })
        }
      />
    </div>
  );
}

export default function Editor() {
  const [schema, setSchema] = useState({
    elements: {},
    layout: { root: 'root', structure: { root: [] } },
  });

  return (
    <EditorProvider
      materials={materials}
      schema={schema}
      onChange={setSchema}
      plugins={[historyPlugin()]}
    >
      <div style={{ display: 'flex', height: '100vh' }}>
        <MaterialPanel />
        <CanvasEditor style={{ flex: 1, background: '#f5f5f5' }} />
        <PropertyPanel />
      </div>
      <DragOverlay />
    </EditorProvider>
  );
}

function MaterialPanel() {
  const { materials } = useEditorCore();
  return (
    <div style={{ width: 200, padding: 16, borderRight: '1px solid #ddd' }}>
      <h4>Components</h4>
      {materials.map((m) => (
        <Draggable key={m.type} material={m}>
          <div style={{ padding: 8, border: '1px solid #eee', marginBottom: 8, cursor: 'move' }}>
            {m.title}
          </div>
        </Draggable>
      ))}
    </div>
  );
}
```

## 📘 API Reference

### `<EditorProvider />`

Root component providing editor context.

| Prop        | Type               | Required | Description                   |
| ----------- | ------------------ | :------: | ----------------------------- |
| `materials` | `Material[]`       |    ✓     | Available component materials |
| `schema`    | `Schema`           |          | Initial schema                |
| `plugins`   | `Plugin[]`         |          | Editor plugins                |
| `onChange`  | `(schema) => void` |          | Schema change callback        |

```tsx
<EditorProvider
  materials={materials}
  schema={initialSchema}
  plugins={[historyPlugin()]}
  onChange={(newSchema) => console.log('Updated:', newSchema)}
>
  {/* Editor UI */}
</EditorProvider>
```

### `<CanvasEditor />`

Visual editing canvas component.

| Prop                | Type                               | Description             |
| ------------------- | ---------------------------------- | ----------------------- |
| `renderElement`     | `(element, children) => ReactNode` | Custom element renderer |
| `renderPlaceholder` | `() => ReactNode`                  | Empty state renderer    |

```tsx
<CanvasEditor renderPlaceholder={() => <div className='empty'>Drag components here</div>} />
```

### `useEditorCore()`

Hook for accessing editor state and methods.

```typescript
const {
  // State
  schema, // Current schema
  activeId, // Selected element ID
  materials, // Registered materials
  engine, // Engine instance
  dragElement, // Currently dragging material

  // Methods
  setSchema, // Update schema
  setActiveId, // Set selection
  updateElement, // Update element props
  deleteElement, // Delete element
  insertElement, // Insert new element
} = useEditorCore();
```

### `<Draggable />`

Make materials draggable from the panel.

```tsx
<Draggable material={buttonMaterial}>
  <div className='material-item'>
    <Icon /> Button
  </div>
</Draggable>
```

### `<DragOverlay />`

Render drag preview overlay.

```tsx
<DragOverlay>
  <div className='drag-preview'>Dragging...</div>
</DragOverlay>
```

## 🎨 Material Definition

```typescript
interface Material {
  type: string; // Unique identifier
  title: string; // Display name
  Component: ComponentType; // React component
  defaultProps?: Record<string, any>;
  icon?: ReactNode;
  category?: string;
  isContainer?: boolean; // Can contain children
  isBlock?: boolean; // Block-level element
  dropTypes?: string[]; // Allowed parent types
  editorConfig?: EditorConfig; // Property panel config
  contextConfig?: ContextConfig; // Flow context config
}
```

**Example:**

```tsx
const buttonMaterial: Material = {
  type: 'button',
  title: 'Button',
  category: 'Basic',
  icon: <ButtonIcon />,
  Component: ({ children, type, ...props }) => (
    <button className={`btn btn-${type}`} {...props}>
      {children}
    </button>
  ),
  defaultProps: {
    children: 'Click Me',
    type: 'primary',
  },
  editorConfig: {
    panels: [
      {
        title: 'Properties',
        configs: [
          { field: 'children', label: 'Text', uiType: 'input' },
          {
            field: 'type',
            label: 'Type',
            uiType: 'select',
            props: { options: ['primary', 'default', 'danger'] },
          },
        ],
      },
    ],
  },
};
```

## 🔌 Plugin System

```typescript
import { definePlugin } from '@tangramino/base-editor';

const myPlugin = definePlugin(() => ({
  id: 'my-plugin',

  // Lifecycle
  onInit(ctx) {
    console.log('Editor initialized');
    return () => console.log('Cleanup');
  },

  // Transform materials
  transformMaterials(materials) {
    return materials.map((m) => ({
      ...m,
      defaultProps: { ...m.defaultProps, 'data-editor': true },
    }));
  },

  // Schema hooks
  onBeforeInsert(schema, parentId, element) {
    console.log('Inserting:', element);
    return true; // return false to prevent
  },

  onAfterRemove(schema, elementId) {
    console.log('Removed:', elementId);
  },
}));
```

### Built-in History Plugin

```tsx
import { historyPlugin } from '@tangramino/base-editor';

<EditorProvider plugins={[historyPlugin()]}>{/* ... */}</EditorProvider>;
```

## 📦 Complete Example

See [playground/antd-demo](../../playground/antd-demo) for a production-ready implementation.
