# @tangramino/base-editor

[English](./README.md) | 简体中文

---

**生产级拖拽可视化编辑器框架**

构建强大的低代码编辑器：拖拽交互、画布管理、物料系统和插件架构。基于 `dnd-kit` 构建，交互流畅。

## ✨ 特性

| 特性            | 描述                   |
| --------------- | ---------------------- |
| 🎯 **拖拽功能** | 内置 dnd-kit 集成      |
| 🎨 **物料系统** | 定义可复用的组件物料   |
| 🔌 **插件架构** | 通过插件扩展功能       |
| 📜 **历史记录** | 内置撤销/重做支持      |
| 🖼️ **画布管理** | 选中、定位、覆盖层     |
| 🛡️ **类型安全** | 完整的 TypeScript 支持 |

## 📦 安装

```bash
npm install @tangramino/base-editor
```

## 🚀 快速开始

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor, Draggable, useEditorCore } from '@tangramino/base-editor';

const materials = [
  {
    type: 'button',
    title: '按钮',
    Component: (props) => <button {...props}>{props.children || '点击'}</button>,
    defaultProps: { children: '按钮' },
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

## 📘 API 参考

### `<EditorProvider />`

| 属性        | 类型               | 必填 | 描述            |
| ----------- | ------------------ | :--: | --------------- |
| `materials` | `Material[]`       |  ✓   | 可用的组件物料  |
| `schema`    | `Schema`           |      | 初始 Schema     |
| `plugins`   | `Plugin[]`         |      | 编辑器插件      |
| `onChange`  | `(schema) => void` |      | Schema 变更回调 |

### `useEditorCore()`

```typescript
const {
  schema, // 当前 Schema
  activeId, // 选中的元素 ID
  materials, // 注册的物料
  setActiveId, // 设置选中
  updateElement, // 更新元素属性
  deleteElement, // 删除元素
  insertElement, // 插入新元素
} = useEditorCore();
```

### 物料定义

```typescript
interface Material {
  type: string; // 唯一标识符
  title: string; // 显示名称
  Component: ComponentType; // React 组件
  defaultProps?: object; // 默认属性
  isContainer?: boolean; // 是否为容器
  editorConfig?: EditorConfig;
}
```

## 🔌 插件系统

```typescript
import { definePlugin } from '@tangramino/base-editor';

const myPlugin = definePlugin(() => ({
  id: 'my-plugin',

  transformMaterials(materials) {
    // 转换物料
    return materials;
  },

  onBeforeInsert(schema, parentId, element) {
    // 插入前校验
    return true;
  },
}));
```

## 📄 License

MIT
