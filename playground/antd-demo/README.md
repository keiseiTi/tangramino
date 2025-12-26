# Tangramino Antd Demo

**Production-ready low-code editor implementation**

A comprehensive example demonstrating how to build a complete low-code platform using Tangramino packages and Ant Design components.

## 🎯 Overview

This demo showcases a full-featured visual page builder with:

- **25+ Ant Design Components**: Button, Form, Table, Modal, Drawer, Input, Select, DatePicker, and more
- **Drag & Drop Editor**: Intuitive material panel and canvas for visual editing
- **Property Configuration**: Dynamic property panels for all components
- **Logic Designer**: Visual workflow editor for complex interactions
- **Data Management**: Global variables, data sources, and context options
- **Production Features**: Undo/redo, schema export/import, preview mode

## ✨ Features

### Visual Editor

- 📦 **Material Panel**: Organized component library with drag-and-drop
- 🎨 **Canvas**: Real-time visual editing with element selection
- ⚙️ **Property Panel**: Context-aware property configuration
- 📐 **Layout Tools**: Alignment, spacing, and positioning controls

### Logic Flow Editor

- 🔀 **Workflow Designer**: Visual logic orchestration
- 🎯 **Logic Nodes**:
  - Interface requests (HTTP calls)
  - Conditional branching
  - Element state manipulation
  - Global variable management
  - Modal/drawer operations
  - Custom JavaScript execution

### Data & State

- 🌐 **Global Variables**: App-wide state management
- 📊 **Data Sources**: Configure API endpoints and data bindings
- 🔗 **Context Options**: Dynamic dropdown options from APIs
- 🔄 **Event System**: Component interactions and callbacks

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16
- pnpm (recommended) or npm

### Installation & Run

```bash
# From project root
pnpm install

# Start the demo
pnpm dev:antd

# Or navigate to demo directory
cd playground/antd-demo
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── code-editor/     # Monaco-based code editor
│   ├── color-picker/    # Color selection component
│   ├── function-editor/ # Function/event configuration
│   ├── hyper-input/     # Advanced input with dynamic values
│   └── ...
├── editor/              # Main page editor
│   ├── index.tsx        # Editor entry point
│   └── mods/            # Editor modules
│       ├── attribute-panel.tsx    # Property configuration
│       ├── material-panel.tsx     # Component library
│       ├── main-content.tsx       # Canvas area
│       ├── data-source-panel.tsx  # API configuration
│       └── ...
├── flow-editor/         # Logic flow editor
│   ├── index.tsx
│   ├── mods/            # Flow editor modules
│   └── nodes/           # Logic node definitions
│       ├── condition/
│       ├── interface-request/
│       ├── set-element-props/
│       └── ...
├── materials/           # Component materials
│   ├── button/
│   ├── form/
│   ├── table/
│   ├── modal/
│   └── ...              # 25+ components
├── plugins/             # Editor plugins
│   ├── material.ts      # Material management
│   ├── form.tsx         # Form enhancement
│   └── portal.ts        # Modal/drawer portal
├── renderer/            # Preview mode renderer
└── preview/             # Preview page
```

## 🎨 Component Materials

### Basic Components

- **Button**: Click actions with variants (primary, default, dashed, link)
- **Text**: Static text display with typography options
- **Container**: Layout wrapper with flex/grid support
- **Input**: Text input with validation
- **Number**: Numeric input with step control
- **Textarea**: Multi-line text input

### Form Components

- **Form**: Form container with validation
- **Select**: Dropdown selection (single/multiple)
- **Checkbox**: Boolean selection
- **Radio**: Single choice from options
- **DatePicker**: Date selection
- **DatePickerRange**: Date range selection
- **TimePicker**: Time selection
- **Cascader**: Hierarchical selection
- **TreeSelect**: Tree structure selection
- **Upload**: File upload with preview

### Data Display

- **Table**: Data grid with sorting, filtering, pagination
- **Tabs**: Tabbed interface
- **Tree**: Hierarchical data display

### Feedback

- **Modal**: Dialog overlay
- **Drawer**: Side panel
- **FloatButton**: Floating action button

### Advanced

- **Slider**: Range selection
- **Switch**: Toggle control

## 🔌 Plugins

### Material Plugin

Manages component library and provides material-related utilities.

```typescript
// plugins/material.ts
export const materialPlugin = definePlugin({
  name: 'material',
  apply: (context) => {
    // Register materials
    context.materials.forEach((material) => {
      registerMaterial(material);
    });
  },
});
```

### Form Plugin

Enhances form components with validation and data binding.

```typescript
// plugins/form.tsx
export const formPlugin = definePlugin({
  name: 'form',
  apply: (context) => {
    // Inject form context
    // Handle form submission
    // Manage form state
  },
});
```

### Portal Plugin

Manages modal and drawer rendering outside the canvas.

```typescript
// plugins/portal.ts
export const portalPlugin = definePlugin({
  name: 'portal',
  apply: (context) => {
    // Handle modal/drawer portals
  },
});
```

## 🛠️ Customization

### Adding New Components

1. **Create Material Definition**

```typescript
// materials/my-component/material-config.ts
export const myComponentMaterial = {
  type: 'myComponent',
  title: 'My Component',
  category: 'Custom',
  Component: MyComponent,
  props: {
    // Default props
  },
};
```

2. **Implement Component**

```tsx
// materials/my-component/index.tsx
export const MyComponent = ({ children, ...props }) => {
  return (
    <div className='my-component' {...props}>
      {children}
    </div>
  );
};
```

3. **Register Material**

```typescript
// materials/index.ts
import { myComponentMaterial } from './my-component/material-config';

export const materials = [
  // ... existing materials
  myComponentMaterial,
];
```

### Adding Logic Nodes

1. **Define Node**

```typescript
// flow-editor/nodes/my-node/index.tsx
export const myLogicNode: FlowNode = {
  type: 'myLogic',
  title: 'My Logic',
  nodeMeta: {
    defaultPorts: [
      { id: 'in', type: 'input' },
      { id: 'out', type: 'output' }
    ]
  },
  renderNode: ({ data }) => (
    <div className="logic-node">
      {/* Node UI */}
    </div>
  ),
  execute: async (context, nodeData) => {
    // Logic execution
    return { success: true };
  }
};
```

2. **Register Node**

```typescript
// flow-editor/nodes/index.ts
import { myLogicNode } from './my-node';

export const logicNodes = [
  // ... existing nodes
  myLogicNode,
];
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the demo directory:

```env
# API Base URL
VITE_API_BASE_URL=https://api.example.com

# Enable debug mode
VITE_DEBUG=true
```

### Material Categories

Organize materials in `materials/group.ts`:

```typescript
export const materialGroups = {
  basic: ['button', 'text', 'container'],
  form: ['input', 'select', 'checkbox', 'radio'],
  data: ['table', 'tree'],
  feedback: ['modal', 'drawer'],
  // ... custom categories
};
```

## 📊 Data Flow

### Global Variables

Define and use global state:

```typescript
// Set in logic flow
setGlobalVariable('userName', 'John Doe');

// Access in components
const userName = useGlobalVariable('userName');
```

### Data Sources

Configure API endpoints:

```typescript
const dataSources = {
  userList: {
    url: '/api/users',
    method: 'GET',
    transform: (data) => data.users,
  },
};
```

### Context Options

Dynamic options from API:

```typescript
const contextOptions = {
  cities: {
    url: '/api/cities',
    valueField: 'id',
    labelField: 'name',
  },
};
```

## 🎯 Use Cases

### Building a CRUD Interface

1. Add a **Table** component for data display
2. Add **Button** components for actions (Add, Edit, Delete)
3. Add a **Modal** with **Form** for data entry
4. Configure logic flows:
   - Load data on page mount
   - Handle button clicks to open modal
   - Submit form to API
   - Refresh table on success

### Creating a Multi-Step Form

1. Add **Tabs** component
2. Add **Form** components in each tab
3. Add navigation **Buttons**
4. Configure logic:
   - Validate current step before proceeding
   - Store data in global variables
   - Submit all data on final step

### Building a Dashboard

1. Add **Container** components for layout
2. Add **Table**, **Chart** components for data
3. Add **Select**, **DatePicker** for filters
4. Configure logic:
   - Load data on filter change
   - Update visualizations
   - Handle real-time updates

## 🧪 Development

### Dev

```bash
pnpm start
```

### Building

```bash
pnpm build
```

## 📚 Learning Path

1. **Start Simple**: Drag a few components onto the canvas
2. **Configure Properties**: Click elements and modify their properties
3. **Add Interactions**: Create logic flows for button clicks
4. **Manage Data**: Set up global variables and data sources
5. **Build Complex UIs**: Combine components and logic for real applications

## 🔗 Related Resources

- **[Tangramino Documentation](https://keiseiti.github.io/tangramino/)**
- **[Ant Design](https://ant.design/)**
- **[FlowGram.AI](https://flowgram.ai/)**

## 🤝 Contributing

This demo serves as both a reference implementation and a testing ground for new features. Contributions are welcome!

## 📄 License

MIT

---

**Built with ❤️ using Tangramino**
