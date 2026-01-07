# Base Editor

`@tangramino/base-editor` 提供可视化编辑器的核心能力，包括拖拽系统、画布编辑器、物料管理等。

## 安装

```bash
npm install @tangramino/base-editor
# 或
pnpm add @tangramino/base-editor
```

## EditorProvider

编辑器上下文提供者，是构建编辑器的根组件。管理 Schema 状态、插件、物料，并处理所有拖拽操作。

```tsx
import { EditorProvider } from '@tangramino/base-editor';

<EditorProvider
  schema={initialSchema}
  materials={materials}
  plugins={[historyPlugin]}
  onChange={(newSchema) => console.log(newSchema)}
>
  <CanvasEditor />
</EditorProvider>;
```

### Props

| 属性      | 类型                       | 必填 | 说明                |
| --------- | -------------------------- | ---- | ------------------- |
| schema    | `Schema`                   | 否   | 初始 Schema         |
| materials | `Material[]`               | 是   | 可用物料数组        |
| plugins   | `EditorPlugin[]`           | 否   | 编辑器插件数组      |
| children  | `React.ReactNode`          | 否   | 子组件              |
| onChange  | `(schema: Schema) => void` | 否   | Schema 变化时的回调 |

## CanvasEditor

画布编辑器组件，负责渲染可编辑的画布区域。

```tsx
import { CanvasEditor } from '@tangramino/base-editor';

<CanvasEditor
  className="canvas"
  style={{ height: '100vh' }}
  renderElement={({ children, elementProps, material }) => (
    <div className="element-wrapper">{children}</div>
  )}
  renderDropIndicator={({ position }) => (
    <div className={`drop-indicator ${position}`} />
  )}
  renderOverlayContent={() => <ToolBar />}
/>;
```

### Props

| 属性                 | 类型                                                 | 说明                 |
| -------------------- | ---------------------------------------------------- | -------------------- |
| style                | `React.CSSProperties`                                | 画布样式             |
| className            | `string`                                             | 画布 CSS 类名        |
| overlayStyle         | `React.CSSProperties`                                | 覆盖层样式           |
| overlayClassNames    | `string`                                             | 覆盖层 CSS 类名      |
| renderElement        | `(props: EnhancedComponentProps) => React.ReactNode` | 自定义元素渲染       |
| renderDropIndicator  | `(props: DropPlaceholderProps) => React.ReactNode`   | 自定义拖放指示器渲染 |
| renderOverlayContent | `() => React.ReactNode`                              | 覆盖层内容渲染       |

### EnhancedComponentProps

```typescript
interface EnhancedComponentProps {
  children: React.ReactElement;
  elementProps: Record<string, unknown>;
  material: Material;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}
```

## Draggable

可拖拽组件，用于物料面板中的可拖拽物料项。

```tsx
import { Draggable } from '@tangramino/base-editor';

<Draggable material={buttonMaterial} className="material-item">
  <div>按钮</div>
</Draggable>;
```

### Props

| 属性        | 类型                  | 必填 | 说明                                   |
| ----------- | --------------------- | ---- | -------------------------------------- |
| material    | `Material`            | 是   | 物料配置                               |
| children    | `React.ReactNode`     | 否   | 子元素                                 |
| className   | `string`              | 否   | CSS 类名                               |
| style       | `React.CSSProperties` | 否   | 样式                                   |
| isTransform | `boolean`             | 否   | 是否启用拖拽时的变换效果，默认 `false` |

## Movable

可移动组件，用于在画布中移动已有元素。

```tsx
import { Movable } from '@tangramino/base-editor';

<Movable className="move-handle" onClick={handleClick}>
  <MoveIcon />
</Movable>;
```

### Props

| 属性      | 类型                            | 说明     |
| --------- | ------------------------------- | -------- |
| children  | `React.ReactNode`               | 子元素   |
| className | `string`                        | CSS 类名 |
| onClick   | `(e: React.MouseEvent) => void` | 点击回调 |

## DragOverlay

拖拽覆盖层组件，显示拖拽时的预览效果。

```tsx
import { DragOverlay } from '@tangramino/base-editor';

<DragOverlay>
  <div className="drag-preview">拖拽预览</div>
</DragOverlay>;
```

### Props

| 属性     | 类型              | 说明                 |
| -------- | ----------------- | -------------------- |
| children | `React.ReactNode` | 拖拽时显示的预览内容 |

## useEditorCore

编辑器核心状态 Hook，用于访问和操作编辑器状态。

```tsx
import { useEditorCore } from '@tangramino/base-editor';

function MyComponent() {
  const {
    schema,
    engine,
    materials,
    activeElement,
    insertPosition,
    dragElement,
    setSchema,
    setActiveElement,
  } = useEditorCore();

  // 使用状态...
}
```

### 返回值

| 属性              | 类型                                         | 说明           |
| ----------------- | -------------------------------------------- | -------------- |
| engine            | `Engine`                                     | 引擎实例       |
| schema            | `Schema`                                     | 当前 Schema    |
| setSchema         | `(schema: Schema) => void`                   | 更新 Schema    |
| materials         | `Material[]`                                 | 物料列表       |
| setMaterials      | `(materials: Material[]) => void`            | 更新物料列表   |
| activeElement     | `ActiveElement \| null`                      | 当前激活的元素 |
| setActiveElement  | `(element: ActiveElement \| null) => void`   | 设置激活元素   |
| insertPosition    | `InsertPosition \| null`                     | 当前插入位置   |
| setInsertPosition | `(position: InsertPosition \| null) => void` | 设置插入位置   |
| dragElement       | `DragElement \| null`                        | 当前拖拽的元素 |
| setDragElement    | `(element: DragElement \| null) => void`     | 设置拖拽元素   |

### ActiveElement 类型

```typescript
interface ActiveElement {
  id: string;
  type: string;
  props: Record<string, unknown>;
  material: Material;
  parents?: ActiveElement[];
}
```

### InsertPosition 类型

```typescript
interface InsertPosition {
  id: string;
  position: 'before' | 'after' | 'up' | 'down';
}
```

## Material

物料定义接口，描述可在编辑器中使用的组件。

```typescript
interface Material {
  // 物料对应的 React 组件
  Component: React.ComponentType;
  // 物料名称
  title: string;
  // 物料类型唯一标识
  type: string;
  // 物料图标
  icon?: React.ReactNode;
  // 允许拖拽到的物料类型
  dropTypes?: string[];
  // 默认属性
  defaultProps?: Record<string, unknown>;
  // 是否为容器
  isContainer?: boolean;
  // 是否为块级元素
  isBlock?: boolean;
  // 编辑器配置
  editorConfig?: EditorConfig;
  // 上下文配置
  contextConfig?: ContextConfig;
}
```

### Material 示例

```tsx
const ButtonMaterial: Material = {
  Component: Button,
  title: '按钮',
  type: 'Button',
  icon: <ButtonIcon />,
  defaultProps: {
    text: '点击我',
    type: 'primary',
  },
  isContainer: false,
  isBlock: true,
  editorConfig: {
    panels: [
      {
        title: '基础配置',
        configs: [
          { field: 'text', label: '按钮文字', uiType: 'input' },
          { field: 'type', label: '按钮类型', uiType: 'select' },
        ],
      },
    ],
  },
};
```

## MaterialComponentProps

物料组件自动注入的 Props。

```typescript
interface MaterialComponentProps {
  // 元素实例 ID
  'data-element-id'?: string;
  // 是否只读
  tg_readonly?: boolean;
  // 当前模式
  tg_mode?: 'design' | 'render';
  // 拖拽占位符（仅容器有）
  tg_dropPlaceholder?: React.ReactNode;
  // 设置上下文值
  tg_setContextValues?: (values: Record<string, unknown>) => void;
}
```

## EditorConfig

编辑器配置，定义物料的属性面板。

```typescript
interface EditorConfig {
  panels?: PanelConfig[];
}

interface PanelConfig {
  // 面板标题
  title?: React.ReactNode;
  // 属性配置
  configs?: AttributeConfig[];
}

interface AttributeConfig {
  // 属性标签
  label?: React.ReactNode;
  // 属性字段名
  field: string;
  // UI 类型
  uiType?: string;
  // 默认值
  defaultValue?: string | number | boolean;
  // 是否必填
  required?: boolean;
  // 联动显示
  linkageShow?: {
    field: string;
    value?: string | number | boolean;
    isNotEmpty?: boolean;
  }[];
  // 自定义渲染
  render?: (props: AttributeConfig) => React.ReactNode;
}
```
