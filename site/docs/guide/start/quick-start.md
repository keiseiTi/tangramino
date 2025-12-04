# 快速开始

本指南将帮助你快速集成 Tangramino 并搭建一个最简单的编辑器。

## 1. 安装依赖

首先，你需要安装 React 环境。如果你还没有项目，可以使用 Vite 创建一个：

```bash
npm create vite@latest my-editor -- --template react-ts
cd my-editor
npm install
```

然后安装 Tangramino 的核心包：

```bash
npm install @tangramino/base-editor @tangramino/engine
```

## 2. 定义物料

在 `src` 目录下创建一个简单的物料。

```tsx
// src/materials/Button.tsx
import { Button } from 'antd'; // 假设你使用了 Ant Design
import type { Material } from '@tangramino/base-editor';

export const ButtonMaterial: Material = {
  type: 'button',
  title: '按钮',
  Component: Button,
  props: {
    children: '点击我',
    type: 'primary',
  },
};
```

> 提示：记得安装 `antd`：`npm install antd`

## 3. 创建编辑器

修改 `src/App.tsx`：

```tsx
import React from 'react';
import { EditorProvider, CanvasEditor, DragOverlay, useEditorCore } from '@tangramino/base-editor';
import { ButtonMaterial } from './materials/Button';
import 'antd/dist/reset.css'; // 引入 Antd 样式

// 初始 Schema
const initialSchema = {
  elements: {},
  layout: {
    root: 'root',
    structure: { root: [] },
  },
};

// 注册物料
const materials = [ButtonMaterial];

// 侧边栏组件：展示物料
const Sidebar = () => {
  const { dragElement } = useEditorCore();
  // 这里可以使用 Draggable 组件来实现拖拽源，具体参考 base-editor 文档
  return <div style={{ width: 200, borderRight: '1px solid #ddd' }}>物料区</div>;
};

const App = () => {
  return (
    <EditorProvider schema={initialSchema} materials={materials}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 20, background: '#f0f2f5' }}>
          <div style={{ background: '#fff', minHeight: '100%' }}>
            <CanvasEditor />
          </div>
        </div>
      </div>
      <DragOverlay />
    </EditorProvider>
  );
};

export default App;
```

## 4. 运行

```bash
npm run dev
```

打开浏览器，你应该能看到一个简单的编辑器界面。虽然现在还比较简陋（比如侧边栏还没实现具体的拖拽源），但编辑器的核心骨架已经搭建完毕。

下一步：
- 学习如何 [自定义编辑器](../advanced/custom-editor.md) 以实现侧边栏和属性面板。
- 了解 [物料体系](../concept/material.md) 以开发更复杂的组件。
