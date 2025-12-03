# @tangramino/base-editor

基于 `@tangramino/engine` 和 `@tangramino/react` 构建的通用可视化拖拽编辑器框架。它提供了一套完整的编辑器 UI 骨架和交互逻辑，让你可以快速搭建出自定义的低代码编辑器。

## ✨ 特性

- **拖拽系统**：内置基于 `dnd-kit` 的拖拽交互，支持物料到画布、画布内的拖拽排序。
- **核心上下文**：`EditorProvider` 管理全局编辑器状态（Schema、选中态、拖拽态）。
- **可插拔**：支持插件系统，可扩展编辑器行为。
- **UI 无关**：不绑定特定 UI 组件库（如 Antd），你可以使用任何 React 组件作为物料。

## 📦 安装

```bash
npm install @tangramino/base-editor
# 或者
yarn add @tangramino/base-editor
```

## 🔨 快速开始

### 1. 定义物料

物料是构成页面的基本单元。

```tsx
// ButtonMaterial.tsx
import { Button } from 'antd';

export const ButtonMaterial = {
  type: 'button',
  title: '按钮',
  Component: Button, // 渲染组件
  props: {
    children: 'Click me',
  },
};
```

### 2. 构建编辑器

使用 `EditorProvider` 包裹你的应用，并使用 `CanvasEditor` 渲染画布。

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor, DragOverlay } from '@tangramino/base-editor';
import { ButtonMaterial } from './ButtonMaterial';

const materials = [ButtonMaterial];
const initialSchema = { /* ... */ };

const App = () => {
  return (
    <EditorProvider materials={materials} schema={initialSchema}>
      <div className="editor-layout">
        {/* 左侧物料区 */}
        <div className="sidebar">
           {/* 实现你的物料面板 */}
        </div>

        {/* 中间画布区 */}
        <div className="canvas-container">
          <CanvasEditor renderElement={(element) => {
              // 自定义元素渲染逻辑
              const Component = element.material.Component;
              return <Component {...element.props} />;
          }} />
        </div>
        
        {/* 右侧属性区 */}
        <div className="settings">
           {/* 实现你的属性面板 */}
        </div>
      </div>
      
      {/* 拖拽时的预览层 */}
      <DragOverlay />
    </EditorProvider>
  );
};
```

## 核心 API

### `EditorProvider`

编辑器的根组件，提供上下文。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `materials` | `Material[]` | 注册的物料列表 |
| `schema` | `Schema` | 初始 Schema |
| `plugins` | `Plugin[]` | 插件列表 |

### `useEditorCore`

获取编辑器核心状态和方法的 Hook。

```tsx
const { 
  schema,       // 当前 Schema
  setSchema,    // 更新 Schema
  activeId,     // 当前选中元素 ID
  setActiveId,  // 设置选中元素
  dragElement,  // 当前拖拽的元素
} = useEditorCore();
```
