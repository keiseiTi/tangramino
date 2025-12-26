# 介绍

**Tangramino** 是一个基于 React 的可视化编辑器框架，专为低代码平台、表单设计器或营销页面搭建工具提供底层基础设施。

## 核心理念

### 1. Schema 驱动

应用的核心是一份 JSON 数据（Schema），描述页面结构、属性和逻辑。Tangramino 通过操作 Schema 来驱动视图更新，确保数据可序列化和跨平台传输。

```typescript
// Schema 示例
const schema = {
  elements: {
    root: { type: 'container', props: {} },
    'btn-1': { type: 'button', props: { text: '点击' } },
  },
  layout: {
    root: 'root',
    structure: { root: ['btn-1'] },
  },
};
```

### 2. 分层架构

| 层级           | 包名                      | 职责                                        |
| -------------- | ------------------------- | ------------------------------------------- |
| **引擎层**     | `@tangramino/engine`      | Schema 管理、事件分发、数据流转（框架无关） |
| **视图层**     | `@tangramino/react`       | 订阅引擎状态，渲染 React 组件树             |
| **编辑器层**   | `@tangramino/base-editor` | 拖拽交互、选中状态、插件系统、物料注册      |
| **流程编辑器** | `@tangramino/flow-editor` | 可视化工作流设计                            |

### 3. 插件优先

通过插件系统扩展功能，而非修改核心代码：

```typescript
import { definePlugin } from '@tangramino/base-editor';

const myPlugin = definePlugin(() => ({
  id: 'my-plugin',
  onInit(ctx) {
    console.log('编辑器已初始化');
  },
  transformMaterials(materials) {
    // 批量修改物料
    return materials;
  },
}));
```

## 适用场景

| 场景         | 描述                           |
| ------------ | ------------------------------ |
| **页面搭建** | 通过拖拽组件构建静态或动态页面 |
| **动态表单** | 可视化配置表单结构及校验规则   |
| **逻辑编排** | 设计工作流或业务规则链         |
| **仪表盘**   | 自定义数据可视化面板           |

## 快速选择

```
你想做什么？
│
├─ 渲染 Schema（无编辑）
│   └→ @tangramino/react
│
├─ 构建页面编辑器
│   └→ @tangramino/base-editor
│
├─ 构建流程编辑器
│   └→ @tangramino/flow-editor
│
└─ 完全自定义
    └→ @tangramino/engine + @tangramino/react
```

## 下一步

- [快速开始](./quick-start.md) - 5 分钟搭建第一个编辑器
- [Schema 协议](../concept/schema.md) - 理解数据结构
- [物料体系](../concept/material.md) - 定义可用组件
