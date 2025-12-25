# 快速开始

本指南将演示如何集成 `@tangramino/base-editor` 并搭建一个最小化的可视化编辑器。

## 1. 安装依赖

首先，确保你的项目是基于 React 的环境。安装核心包：

```bash
npm install @tangramino/base-editor @tangramino/engine @tangramino/react @dnd-kit/core
# 或
pnpm add @tangramino/base-editor @tangramino/engine @tangramino/react @dnd-kit/core
```

## 2. 定义物料

物料是编辑器中的组件单元。我们需要定义组件的实现以及它在编辑器中的配置。

```tsx
// src/materials/Button.tsx
import React from 'react';
import type { Material } from '@tangramino/base-editor';

// 1. 也是运行时渲染的组件
const ButtonComponent = ({ text, ...props }: any) => {
  return <button {...props}>{text || '按钮'}</button>;
};

// 2. 物料定义
export const ButtonMaterial: Material = {
  type: 'button', // 唯一标识
  title: '按钮',   // 显示名称
  Component: ButtonComponent, // 关联组件
  defaultProps: {
    text: '点击我',
  },
  // 编辑器属性面板配置
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          { label: '文本', field: 'text', uiType: 'input' },
        ],
      },
    ],
  },
};
```

## 3. 创建编辑器

使用 `EditorProvider` 包裹应用，并配置 `CanvasEditor` 和物料面板。

```tsx
// src/App.tsx
import React from 'react';
import { 
  EditorProvider, 
  CanvasEditor, 
  DragOverlay, 
  Draggable,
  useEditorCore 
} from '@tangramino/base-editor';
import { ButtonMaterial } from './materials/Button';
import '@tangramino/base-editor/dist/style.css'; // 引入默认样式

// 初始 Schema
const initialSchema = {
  elements: {},
  layout: {
    root: 'root',
    structure: { root: [] },
  },
  extensions: {},
};

// 注册物料列表
const materials = [ButtonMaterial];

// 简单的侧边栏组件
const Sidebar = () => {
  const { materials } = useEditorCore();
  return (
    <div style={{ width: 200, borderRight: '1px solid #ddd', padding: 10 }}>
      <h3>组件库</h3>
      {materials.map((material) => (
        <Draggable key={material.type} material={material}>
          <div style={{ 
            padding: '8px', 
            border: '1px solid #ccc', 
            marginBottom: '8px', 
            cursor: 'move' 
          }}>
            {material.title}
          </div>
        </Draggable>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <EditorProvider schema={initialSchema} materials={materials}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 20, background: '#f0f2f5' }}>
          {/* 画布区域 */}
          <div style={{ background: '#fff', height: '100%', position: 'relative' }}>
            <CanvasEditor />
          </div>
        </div>
      </div>
      {/* 拖拽时的预览层 */}
      <DragOverlay>
        <div style={{ padding: '8px', border: '1px solid blue', background: '#fff' }}>
          正在拖拽...
        </div>
      </DragOverlay>
    </EditorProvider>
  );
};

export default App;
```

## 4. 运行

启动你的开发服务器，你应该能看到一个包含“组件库”和“画布”的界面。尝试将“按钮”从左侧拖入画布中。

### 下一步

- 了解 [物料体系](../concept/material.md) 以配置更复杂的属性面板。
- 学习 [自定义编辑器](../advanced/custom-editor.md) 来完善属性配置和工具栏。