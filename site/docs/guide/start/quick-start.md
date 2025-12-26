# 快速开始

本指南将帮助你在 5 分钟内搭建一个最小化的可视化编辑器。

## 1. 安装依赖

```bash
# 使用 npm
npm install @tangramino/base-editor @tangramino/engine @tangramino/react

# 或 pnpm
pnpm add @tangramino/base-editor @tangramino/engine @tangramino/react
```

## 2. 定义物料

物料是编辑器中的组件单元，包含组件实现和配置信息。

```tsx
// materials/button.tsx
import React from 'react';
import type { Material } from '@tangramino/base-editor';

// 运行时渲染的组件
const ButtonComponent = ({ text, type = 'default', ...props }: any) => (
  <button className={`btn btn-${type}`} {...props}>
    {text || '按钮'}
  </button>
);

// 物料定义
export const ButtonMaterial: Material = {
  type: 'button',
  title: '按钮',
  Component: ButtonComponent,
  defaultProps: {
    text: '点击我',
    type: 'primary',
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          { label: '文本', field: 'text', uiType: 'input' },
          {
            label: '类型',
            field: 'type',
            uiType: 'select',
            props: { options: ['primary', 'default', 'danger'] },
          },
        ],
      },
    ],
  },
};
```

## 3. 创建编辑器

```tsx
// App.tsx
import React from 'react';
import {
  EditorProvider,
  CanvasEditor,
  DragOverlay,
  Draggable,
  useEditorCore,
} from '@tangramino/base-editor';
import { ButtonMaterial } from './materials/button';

// 初始 Schema（空画布）
const initialSchema = {
  elements: {},
  layout: {
    root: 'root',
    structure: { root: [] },
  },
};

// 物料列表
const materials = [ButtonMaterial];

// 侧边栏：物料面板
function Sidebar() {
  const { materials } = useEditorCore();

  return (
    <div style={{ width: 200, borderRight: '1px solid #ddd', padding: 16 }}>
      <h3 style={{ margin: '0 0 16px' }}>组件库</h3>
      {materials.map((material) => (
        <Draggable key={material.type} material={material}>
          <div
            style={{
              padding: 12,
              border: '1px solid #eee',
              borderRadius: 4,
              marginBottom: 8,
              cursor: 'move',
              background: '#fafafa',
            }}
          >
            {material.title}
          </div>
        </Draggable>
      ))}
    </div>
  );
}

// 主应用
export default function App() {
  return (
    <EditorProvider schema={initialSchema} materials={materials}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 20, background: '#f5f5f5' }}>
          <div
            style={{
              background: '#fff',
              height: '100%',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CanvasEditor />
          </div>
        </div>
      </div>
      <DragOverlay>
        <div
          style={{
            padding: 12,
            border: '2px solid #1890ff',
            background: '#fff',
            borderRadius: 4,
          }}
        >
          拖拽中...
        </div>
      </DragOverlay>
    </EditorProvider>
  );
}
```

## 4. 运行

启动开发服务器，你应该能看到包含「组件库」和「画布」的界面。将「按钮」从左侧拖入画布即可。

```bash
npm run dev
```

## 5. 添加属性面板（可选）

```tsx
function PropertyPanel() {
  const { activeId, schema, updateElement } = useEditorCore();
  const element = activeId ? schema.elements[activeId] : null;

  if (!element) {
    return (
      <div style={{ width: 250, padding: 16, borderLeft: '1px solid #ddd' }}>
        <p style={{ color: '#999' }}>选择一个元素</p>
      </div>
    );
  }

  return (
    <div style={{ width: 250, padding: 16, borderLeft: '1px solid #ddd' }}>
      <h3>属性配置</h3>
      <div style={{ marginBottom: 12 }}>
        <label>文本：</label>
        <input
          value={element.props.text || ''}
          onChange={(e) =>
            updateElement(activeId, {
              props: { ...element.props, text: e.target.value },
            })
          }
          style={{ width: '100%', padding: 8 }}
        />
      </div>
    </div>
  );
}

// 在 App 中添加
<div style={{ display: 'flex', height: '100vh' }}>
  <Sidebar />
  <div style={{ flex: 1 }}>
    <CanvasEditor />
  </div>
  <PropertyPanel />
</div>;
```

## 下一步

- 📖 [物料体系](../concept/material.md) - 配置更复杂的属性面板
- 🔌 [插件系统](../concept/plugin.md) - 扩展编辑器功能
- 🎨 [自定义编辑器](../advanced/custom-editor.md) - 完善工具栏和交互
- 📦 [完整示例](https://github.com/keiseiTi/tangramino/tree/main/playground/antd-demo) - 生产级参考实现
