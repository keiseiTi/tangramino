# 快速上手

本指南将帮助你快速集成 Tangramino 到你的 React 项目中。我们将构建一个简单的可视化编辑器，包含拖拽画布、属性配置和渲染器。

## 安装

使用你喜欢的包管理器安装核心依赖：

```bash
# 使用 npm
npm install @tangramino/base-editor

# 使用 pnpm
pnpm add @tangramino/base-editor

# 使用 yarn
yarn add @tangramino/base-editor
```

## 核心概念

在开始之前，我们需要了解 Tangramino 的三个核心部分：

- **Engine**: 核心逻辑层，负责管理 Schema、状态和事件。
- **Schema**: 描述页面结构、布局和逻辑的 JSON 数据。
- **Material**: 物料（组件）定义，包含 React 组件本身及其在编辑器中的配置（如属性面板、拖拽规则等）。

## 基础示例

### 1. 定义物料 (Material)

首先，我们需要定义一些可拖拽的组件。每个物料包含组件实现和配置信息。

```tsx
// materials/button.tsx
import React from 'react';
import { Material } from '@tangramino/base-editor';

// 1. 组件实现
export const ButtonComponent = ({ text = 'Button', style, onClick }) => (
  <button
    style={style}
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded"
  >
    {text}
  </button>
);

// 2. 物料配置
export const ButtonMaterial: Material = {
  type: 'button', // 唯一标识
  title: '按钮',
  component: ButtonComponent,
  // 编辑器配置
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            field: 'text',
            label: '按钮文字',
            uiType: 'input',
            defaultValue: '点击我',
          },
        ],
      },
    ],
  },
};

// materials/container.tsx
import { Material } from '@tangramino/base-editor';

export const ContainerComponent = ({ children, style }) => (
  <div
    style={{ minHeight: 100, padding: 20, border: '1px dashed #ccc', ...style }}
  >
    {children}
  </div>
);

export const ContainerMaterial: Material = {
  type: 'container',
  title: '容器',
  component: ContainerComponent,
  isContainer: true, // 标记为容器，允许拖入其他组件
};
```

### 2. 构建编辑器

使用 `EditorProvider` 和核心 Hook 构建编辑器界面。

```tsx
import React from 'react';
import {
  EditorProvider,
  CanvasEditor,
  useEditorCore,
  DragOverlay,
  historyPlugin, // 撤销重做插件
  modePlugin, // 预览/编辑模式插件
} from '@tangramino/base-editor';
import { ButtonMaterial, ContainerMaterial } from './materials';

const materials = [ButtonMaterial, ContainerMaterial];

// 左侧物料面板
const MaterialPanel = () => {
  const { dragElement } = useEditorCore(); // 获取拖拽方法

  return (
    <div className="w-64 border-r p-4">
      <h3>组件库</h3>
      <div className="grid grid-cols-2 gap-2">
        {materials.map((m) => (
          <div
            key={m.type}
            // 调用 dragElement 开始拖拽
            onDragStart={(e) => dragElement(e, m)}
            draggable
            className="p-2 border rounded cursor-move hover:bg-gray-50"
          >
            {m.title}
          </div>
        ))}
      </div>
    </div>
  );
};

// 右侧属性面板（需自行实现表单逻辑，Tangramino 提供配置数据）
const SettingPanel = () => {
  const { activeElement } = useEditorCore();

  if (!activeElement)
    return <div className="w-64 border-l p-4">请选择组件</div>;

  return (
    <div className="w-64 border-l p-4">
      <h3>属性配置</h3>
      {/* 根据 activeElement.material.editorConfig 渲染表单 */}
      <pre>{JSON.stringify(activeElement.props, null, 2)}</pre>
    </div>
  );
};

export const App = () => {
  return (
    <EditorProvider
      materials={materials}
      plugins={[historyPlugin(), modePlugin()]} // 注册插件
    >
      <div className="flex h-screen">
        <MaterialPanel />

        {/* 中间画布区域 */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="bg-white min-h-[800px] shadow-lg">
            <CanvasEditor />
          </div>
        </div>

        <SettingPanel />
      </div>

      {/* 拖拽时的跟随效果 */}
      <DragOverlay />
    </EditorProvider>
  );
};
```

### 3. 渲染页面 (Runtime)

在最终的页面中，我们只需要 `@tangramino/engine` 和 `@tangramino/react` 来渲染 Schema。

```tsx
import React, { useMemo } from 'react';
import { createEngine } from '@tangramino/engine';
import { ReactView } from '@tangramino/react';
import { ButtonComponent, ContainerComponent } from './materials';

// 组件映射表
const components = {
  button: ButtonComponent,
  container: ContainerComponent,
};

const PageRenderer = ({ schema }) => {
  // 创建引擎实例
  const engine = useMemo(() => createEngine(schema), [schema]);

  return <ReactView engine={engine} components={components} />;
};
```

## 进阶：流程编排 (Flow Editor)

Tangramino 还提供了强大的逻辑编排能力。

```bash
npm install @tangramino/flow-editor
```

```tsx
import { FlowEditor } from '@tangramino/flow-editor';

const LogicEditor = () => {
  return (
    <div style={{ height: 600 }}>
      <FlowEditor />
    </div>
  );
};
```

更多关于逻辑编排的用法，请参考 [流程编辑器文档](../advanced/custom-editor.md)。

## 下一步

- 深入了解 [Schema 结构](../concept/editor/view.md)
- 学习如何开发 [自定义插件](../plugin/intro.md)
- 探索 [逻辑引擎](../concept/renderer/flow.md) 的工作原理
