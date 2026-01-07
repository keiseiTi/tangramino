# 视图编辑器

视图编辑器基于渲染引擎，但通过 `CanvasEditor` 和 `ElementWrapper` 提供了编辑态的交互能力。

## 核心交互

### 编辑态包装 (ElementWrapper)

在编辑器中，所有物料组件都被 `ElementWrapper` 包裹。与运行时不同，`ElementWrapper` 会注入特定的编辑态属性：

- **`tg_mode="design"`**: 标识当前处于设计模式。
- **`tg_dropPlaceholder`**: 仅当 `material.isContainer` 为 true 时注入，用于显示拖拽放置提示。

```tsx
// packages/base-editor/src/components/element-wrapper.tsx
const extraCompProps: MaterialComponentProps = material.isContainer
  ? {
      tg_dropPlaceholder: (
        <Placeholder ... />
      ),
      tg_mode: 'design',
    }
  : {
      tg_mode: 'design',
    };
```

### 拖拽系统 (Drag & Drop)

拖拽系统是 Tangramino 编辑器的核心交互能力，基于 [@dnd-kit/core](https://dndkit.com/) 构建，支持物料拖入画布和画布内元素移动。

#### 拖拽规则

**Block 元素 vs 非 Block 元素**

编辑器区分两类元素，它们的拖拽行为不同：

| 元素类型          | 判定条件                               | 拖拽位置                                            |
| ----------------- | -------------------------------------- | --------------------------------------------------- |
| **Block 元素**    | `isBlock: true` 或 `isContainer: true` | 只能在其他 Block 元素的**上方**或**下方**插入       |
| **非 Block 元素** | 普通元素（如按钮、文本）               | 可在非 Block 元素**左右**插入，或插入到**容器内部** |

**位置指示**

拖拽过程中会显示位置指示线：

- **水平线（上/下）**：Block 元素的插入位置
- **竖线（左/右）**：非 Block 元素的插入位置

#### dropTypes 限制

物料可以设置 `dropTypes` 来限制其可以放入的容器类型：

```typescript
const ButtonMaterial: Material = {
  type: 'button',
  title: '按钮',
  Component: Button,
  // 只能放入 'form' 或 'card' 类型的容器
  dropTypes: ['form', 'card'],
};
```

如果未设置 `dropTypes`，元素可以放入任何容器。

#### 核心组件

- **Draggable**: 用于物料面板，使物料可被拖拽到画布。
- **Movable**: 用于选中元素的工具栏，使元素可被移动。
- **DragOverlay**: 拖拽时显示的预览层。

```tsx
import { Draggable, Movable, DragOverlay } from '@tangramino/base-editor';

// Draggable usage
<Draggable material={ButtonMaterial}>
  <div>按钮</div>
</Draggable>;

// Movable usage
<Movable>
  <DragOutlined />
</Movable>;
```

#### 实现细节

编辑器使用 `ElementWrapper` 作为 Droppable 区域，处理拖拽事件。

对于容器类物料（如 `Container`, `Form`），组件内部必须正确渲染 `tg_dropPlaceholder`，否则用户在拖拽时无法看到放置位置的提示。

```tsx
// playground/antd-demo/src/materials/container/index.tsx
export const Container = (props: IProps) => {
  const { children, tg_dropPlaceholder, ... } = props;
  return (
    <div ...>
      {children || tg_dropPlaceholder}
    </div>
  );
};
```

#### 自定义拖拽指示

通过 `renderDropIndicator` 自定义容器空状态下的拖拽提示：

```tsx
<CanvasEditor
  renderDropIndicator={({ isDragOver, material }) => (
    <div className={isDragOver ? 'bg-blue-100' : ''}>
      将 {material.title} 拖入此处
    </div>
  )}
/>
```

### 属性配置 (Attribute Panel)

当选中组件时，编辑器会根据物料配置中的 `editorConfig` 生成属性面板。面板中的修改会实时更新 Schema，进而触发视图的重新渲染。

`editorConfig` 定义了属性名 (`field`) 与 UI 控件 (`uiType`) 的映射关系：

```typescript
// playground/antd-demo/src/materials/input/material-config.ts
editorConfig: {
  panels: [
    {
      title: '属性',
      configs: [
        {
          label: '占位符',
          field: 'placeholder', // 对应 props.placeholder
          uiType: 'input',
          props: { placeholder: '请输入...' },
        },
        // ...
      ],
    },
  ],
},
```
