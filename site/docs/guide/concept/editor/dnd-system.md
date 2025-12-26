# 拖拽系统

拖拽系统是 Tangramino 编辑器的核心交互能力，基于 [@dnd-kit/core](https://dndkit.com/) 构建，支持物料拖入画布和画布内元素移动。

## 拖拽规则

### Block 元素 vs 非 Block 元素

编辑器区分两类元素，它们的拖拽行为不同：

| 元素类型          | 判定条件                               | 拖拽位置                                            |
| ----------------- | -------------------------------------- | --------------------------------------------------- |
| **Block 元素**    | `isBlock: true` 或 `isContainer: true` | 只能在其他 Block 元素的**上方**或**下方**插入       |
| **非 Block 元素** | 普通元素（如按钮、文本）               | 可在非 Block 元素**左右**插入，或插入到**容器内部** |

### 位置指示

拖拽过程中会显示位置指示线：

- **水平线（上/下）**：Block 元素的插入位置
- **竖线（左/右）**：非 Block 元素的插入位置

## dropTypes 限制

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

## 核心组件

### Draggable

用于物料面板，使物料可被拖拽到画布：

```tsx
import { Draggable } from '@tangramino/base-editor';

<Draggable material={ButtonMaterial}>
  <div>按钮</div>
</Draggable>;
```

### Movable

用于选中元素的工具栏，使元素可被移动：

```tsx
import { Movable } from '@tangramino/base-editor';

// 在 overlay 工具栏中使用
<Movable>
  <DragOutlined />
</Movable>;
```

### DragOverlay

拖拽时显示的预览层：

```tsx
import { DragOverlay } from '@tangramino/base-editor';

<DragOverlay>
  <div>拖拽预览</div>
</DragOverlay>;
```

## 自定义拖拽指示

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
