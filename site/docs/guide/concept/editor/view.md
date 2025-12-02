# 视图编辑器

视图编辑器基于渲染引擎，但通过 `CanvasEditor` 和 `ElementWrapper` 提供了编辑态的交互能力。

## 核心交互

### 1. 编辑态包装 (ElementWrapper)

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

### 2. 拖拽与放置 (Drag & Drop)

编辑器使用 `@dnd-kit` 实现拖拽。`ElementWrapper` 作为 Droppable 区域，处理拖拽事件。

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

### 3. 属性配置 (Attribute Panel)

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
