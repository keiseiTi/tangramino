# @tangramino/react

Tangramino 引擎的 React 视图层绑定。它负责将 Schema 渲染为 React 组件树。

## ✨ 特性

- **高性能渲染**：基于 React 的高效渲染机制。
- **HOC 支持**：提供高阶组件 (HOC) 机制，方便对组件进行统一包装（如错误边界、数据注入）。
- **Hooks**：提供 `useRenderer` 等 Hooks，方便在组件内获取上下文。

## 📦 安装

```bash
npm install @tangramino/react
# 或者
yarn add @tangramino/react
```

## 🔨 使用

### 1. 准备物料和 Schema

```typescript
import { Button } from 'antd';

const materials = [
  {
    type: 'button',
    Component: Button,
  }
];

const schema = {
  elements: {
    'btn1': { id: 'btn1', type: 'button', props: { children: 'Hello' } }
  },
  layout: {
    root: 'root',
    structure: { 'root': ['btn1'] }
  }
};
```

### 2. 渲染页面

使用 `View` 组件进行渲染。

```tsx
import React from 'react';
import { View } from '@tangramino/react';

const App = () => {
  return (
    <View
      schema={schema}
      materials={materials}
      components={{ button: Button }} // 或者直接传入组件映射
    />
  );
};
```

## 核心 API

### `View`

渲染入口组件。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema` | 页面 Schema |
| `materials` | `Material[]` | 物料列表 (包含 Component) |
| `render` | `Function` | 自定义渲染函数 (可选) |
