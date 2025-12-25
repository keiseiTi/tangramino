# @tangramino/base-editor

**Production-ready drag-and-drop visual editor framework**

Build powerful low-code editors with drag-and-drop, canvas management, and real-time editing. Built on `@tangramino/engine` and `@tangramino/react` with `dnd-kit` for smooth interactions.

## ✨ Features

- **Drag & Drop**: Built-in dnd-kit integration for materials and canvas elements
- **Canvas Management**: Visual editing canvas with selection, positioning, and overlays
- **Material System**: Define reusable component materials with props
- **Plugin Architecture**: Extend editor capabilities with custom plugins
- **UI Agnostic**: Not tied to any UI library - use any React components
- **History Support**: Built-in undo/redo via plugin system

## 📦 Installation

```bash
npm install @tangramino/base-editor
```

> **Peer dependencies:** `react`, `react-dom`, `@tangramino/engine`, `@tangramino/react`, `@dnd-kit/core`

## 🔨 Quick Start

### Minimal Editor (30 lines)

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor } from '@tangramino/base-editor';
import '@tangramino/base-editor/style.css';

// Define materials
const materials = [
  {
    type: 'button',
    title: 'Button',
    Component: (props) => <button {...props} />,
    props: { children: 'Click Me' }
  },
  {
    type: 'text',
    title: 'Text',
    Component: ({ content }) => <p>{content}</p>,
    props: { content: 'Hello' }
  }
];

function App() {
  return (
    <EditorProvider materials={materials}>
      <div style={{ height: '100vh' }}>
        <CanvasEditor />
      </div>
    </EditorProvider>
  );
}

export default App;
```

### Full Editor with Panels

```tsx
import React from 'react';
import {
  EditorProvider,
  CanvasEditor,
  DragOverlay,
  Draggable,
  useEditorCore
} from '@tangramino/base-editor';

function MaterialPanel() {
  const { materials } = useEditorCore();
  
  return (
    <div className="material-panel">
      <h3>Components</h3>
      {materials.map(material => (
        <Draggable key={material.type} material={material}>
          <div className="material-item">
            {material.title}
          </div>
        </Draggable>
      ))}
    </div>
  );
}

function PropertyPanel() {
  const { activeId, schema, updateElement } = useEditorCore();
  const activeElement = activeId ? schema.elements[activeId] : null;
  
  if (!activeElement) return <div>Select an element</div>;
  
  return (
    <div className="property-panel">
      <h3>Properties</h3>
      <input
        value={activeElement.props.children || ''}
        onChange={(e) => updateElement(activeId, { 
          props: { ...activeElement.props, children: e.target.value }
        })}
      />
    </div>
  );
}

function App() {
  return (
    <EditorProvider materials={materials}>
      <div className="editor-layout">
        <aside className="sidebar"><MaterialPanel /></aside>
        <main className="canvas-container"><CanvasEditor /></main>
        <aside className="properties"><PropertyPanel /></aside>
      </div>
      <DragOverlay />
    </EditorProvider>
  );
}
```

## 📘 API Reference

### `EditorProvider`

Root component providing editor context.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `materials` | `Material[]` | ✓ | Available component materials |
| `schema` | `Schema` |  | Initial schema (optional) |
| `plugins` | `Plugin[]` |  | Editor plugins |
| `onChange` | `(schema: Schema) => void` |  | Callback on schema change |

**Example:**

```tsx
<EditorProvider
  materials={materials}
  schema={initialSchema}
  plugins={[historyPlugin, customPlugin]}
  onChange={(newSchema) => {
    console.log('Schema updated:', newSchema);
  }}
>
  {/* Editor UI */}
</EditorProvider>
```

### `CanvasEditor`

Visual editing canvas component.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `renderElement` | `(element, children) => ReactNode` | Custom element renderer |
| `renderPlaceholder` | `() => ReactNode` | Custom empty state |

**Example:**

```tsx
<CanvasEditor
  renderElement={(element, children) => {
    const Component = getMaterialComponent(element.type);
    return (
      <div className={`element-wrapper ${element.type}`}>
        <Component {...element.props}>{children}</Component>
      </div>
    );
  }}
  renderPlaceholder={() => (
    <div className="empty-state">
      Drag components here to start building
    </div>
  )}
/>
```

### `useEditorCore`

Hook for accessing editor state and methods.

**Returns:**

```typescript
{
  // State
  schema: Schema;              // Current schema
  activeId: string | null;     // Selected element ID
  dragElement: Material | null; // Currently dragging material
  materials: Material[];       // Registered materials
  engine: Engine;              // Engine instance
  
  // Methods
  setSchema: (schema: Schema) => void;
  setActiveId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  insertElement: (parentId: string, element: Element, index?: number) => void;
}
```

**Example:**

```tsx
function MyComponent() {
  const { 
    schema, 
    activeId, 
    setActiveId,
    updateElement 
  } = useEditorCore();

  const handleSelect = (id: string) => {
    setActiveId(id);
  };

  return (/* ... */);
}
```

### `Draggable`

Make materials draggable from the material panel.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `material` | `Material` | ✓ | Material definition |
| `children` | `ReactNode` | ✓ | Drag handle element |

**Example:**

```tsx
<Draggable material={buttonMaterial}>
  <div className="material-item">
    <ButtonIcon />
    <span>Button</span>
  </div>
</Draggable>
```

### `DragOverlay`

Render drag preview overlay.

```tsx
<DragOverlay />
```

## 🎨 Material Definition

Materials define the components available in your editor:

```typescript
interface Material {
  type: string;                    // Unique identifier
  title: string;                   // Display name
  Component: ComponentType;        // React component
  props?: Record<string, any>;     // Default props
  category?: string;               // Organization category
  icon?: ReactNode;                // Optional icon
}
```

**Example:**

```tsx
const buttonMaterial: Material = {
  type: 'button',
  title: 'Button',
  category: 'Basic',
  icon: <ButtonIcon />,
  Component: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  props: {
    children: 'Click Me',
    type: 'primary'
  }
};
```

## 🔌 Plugin System

Extend editor functionality with plugins:

```typescript
interface Plugin {
  name: string;
  apply: (context: EditorContext) => void | (() => void);
}
```

**Example - History Plugin:**

```tsx
const historyPlugin: Plugin = {
  name: 'history',
  apply: (context) => {
    const history: Schema[] = [];
    let currentIndex = -1;

    context.engine.on('history', 'ELEMENT_UPDATE', () => {
      history.push(context.schema);
      currentIndex++;
    });

    context.registerAction('undo', () => {
      if (currentIndex > 0) {
        currentIndex--;
        context.setSchema(history[currentIndex]);
      }
    });

    context.registerAction('redo', () => {
      if (currentIndex < history.length - 1) {
        currentIndex++;
        context.setSchema(history[currentIndex]);
      }
    });
  }
};
```

## 🎯 Advanced Usage

### Custom Overlays

Add custom UI overlays to the canvas:

```tsx
import { CanvasOverlay } from '@tangramino/base-editor';

function CustomOverlay() {
  return (
    <CanvasOverlay>
      <div className="custom-toolbar">
        {/* Custom tools */}
      </div>
    </CanvasOverlay>
  );
}
```

### Element Wrapper Customization

Wrap elements with custom UI:

```tsx
import { ElementWrapper } from '@tangramino/base-editor';

<CanvasEditor
  renderElement={(element, children) => (
    <ElementWrapper
      element={element}
      onSelect={() => setActiveId(element.id)}
      onDelete={() => deleteElement(element.id)}
    >
      {children}
    </ElementWrapper>
  )}
/>
```

### Validation

Add validation to prevent invalid operations:

```tsx
const validationPlugin: Plugin = {
  name: 'validation',
  apply: (context) => {
    const originalInsert = context.insertElement;
    
    context.insertElement = (parentId, element, index) => {
      // Validate before insert
      if (!isValidParent(parentId, element.type)) {
        console.error('Invalid parent-child relationship');
        return;
      }
      originalInsert(parentId, element, index);
    };
  }
};
```

## 🎨 Styling

Import the default styles:

```tsx
import '@tangramino/base-editor/style.css';
```

Or provide custom styles:

```css
.canvas-editor {
  background: #f5f5f5;
  min-height: 600px;
}

.element-wrapper {
  border: 2px dashed transparent;
  transition: border-color 0.2s;
}

.element-wrapper.selected {
  border-color: #1890ff;
}
```

## 📦 Complete Example

See the [antd-demo](../../playground/antd-demo) for a production-ready implementation with:
- Material panel with categories
- Property configuration
- Undo/redo
- Schema import/export
- Preview mode

## 📄 License

MIT 
  schema,       // 当前 Schema
  setSchema,    // 更新 Schema
  activeId,     // 当前选中元素 ID
  setActiveId,  // 设置选中元素
  dragElement,  // 当前拖拽的元素
} = useEditorCore();
```
