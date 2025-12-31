# Schema 协议

Schema 是 Tangramino 的核心数据结构，用于描述页面结构、状态和逻辑。它是一个标准 JSON 对象，便于存储、传输和版本控制。

## 核心结构

Schema 采用**扁平化设计**，主要由 `elements`（元素集合）和 `layout`（布局关系）两部分组成：

```typescript
interface Schema {
  /** 元素集合（扁平化存储，O(1) 查询） */
  elements: Elements;

  /** 布局树（父子关系） */
  layout: Layout;

  /** 流程编排数据（可选） */
  flows?: Flows;

  /** 事件绑定（可选） */
  bindElements?: BindElement[];

  /** 依赖导入（可选） */
  imports?: Import[];

  /** 上下文配置（可选） */
  context?: {
    globalVariables?: GlobalVariable[];
  };

  /** 扩展字段 */
  extensions: Record<string, unknown>;
}
```

### Elements

元素集合，以元素 ID 为键，ElementState 为值：

```typescript
type Elements = {
  [elementId: string]: ElementState;
};

interface ElementState {
  type: string; // 组件类型（对应 Material.type）
  props: Record<string, unknown>; // 传递给组件的 props
  hidden?: boolean; // 是否隐藏
}
```

### Layout

布局树结构，定义元素的层级关系：

```typescript
interface Layout {
  root: string; // 根节点 ID
  structure: Record<string, string[]>; // 父ID → 子ID数组
}
```

### Flows

流程编排数据，定义逻辑流程图：

```typescript
type Flows = {
  [flowId: string]: Flow;
};

interface Flow {
  startId: string; // 流程起始节点 ID
  nodes: Record<string, FlowNode>; // 流程节点集合
}

interface FlowNode {
  id: string; // 节点 ID
  type: string; // 节点类型
  props: Record<string, unknown>; // 节点配置
  prev: string[]; // 前置节点 ID 数组
  next: string[]; // 后继节点 ID 数组
}
```

### BindElement

事件绑定配置，将元素事件关联到流程：

```typescript
interface BindElement {
  id: string; // 元素 ID
  event: string; // 事件名称（如 onClick, onChange）
  flowId: string; // 关联的流程 ID
}
```

**示例：**

```json
{
  "bindElements": [
    {
      "id": "btn-1",
      "event": "onClick",
      "flowId": "flow-submit"
    }
  ]
}
```

### Import

依赖导入声明：

```typescript
interface Import {
  name: string; // 包名
  description: string; // 描述
  version: string; // 版本号
  semverTag: 'lock' | 'patch' | 'minor' | 'major'; // 版本策略
}
```

**示例：**

```json
{
  "imports": [
    {
      "name": "lodash",
      "description": "工具库",
      "version": "4.17.21",
      "semverTag": "patch"
    }
  ]
}
```

### GlobalVariable

全局变量定义：

```typescript
interface GlobalVariable {
  name: string; // 变量名
  description: string; // 描述
  type?: string; // 类型（如 string, number, boolean）
  defaultValue?: string | boolean | number; // 默认值
}
```

**示例：**

```json
{
  "context": {
    "globalVariables": [
      {
        "name": "userName",
        "description": "当前用户名",
        "type": "string",
        "defaultValue": ""
      },
      {
        "name": "pageSize",
        "description": "分页大小",
        "type": "number",
        "defaultValue": 10
      },
      {
        "name": "isLoggedIn",
        "description": "登录状态",
        "type": "boolean",
        "defaultValue": false
      }
    ]
  }
}
```

## 完整示例

一个包含容器、输入框、按钮以及逻辑流程的完整 Schema：

```json
{
  "elements": {
    "root": {
      "type": "container",
      "props": { "style": { "padding": 20 } }
    },
    "input-1": {
      "type": "input",
      "props": { "placeholder": "请输入用户名" }
    },
    "btn-1": {
      "type": "button",
      "props": { "text": "提交", "type": "primary" }
    }
  },
  "layout": {
    "root": "root",
    "structure": {
      "root": ["input-1", "btn-1"]
    }
  },
  "bindElements": [
    {
      "id": "btn-1",
      "event": "onClick",
      "flowId": "flow-submit"
    }
  ],
  "flows": {
    "flow-submit": {
      "startId": "start-1",
      "nodes": {
        "start-1": {
          "id": "start-1",
          "type": "start",
          "props": {},
          "prev": [],
          "next": ["request-1"]
        },
        "request-1": {
          "id": "request-1",
          "type": "interfaceRequest",
          "props": {
            "url": "/api/submit",
            "method": "POST"
          },
          "prev": ["start-1"],
          "next": ["condition-1"]
        },
        "condition-1": {
          "id": "condition-1",
          "type": "condition",
          "props": {
            "expression": "{{lastReturnedVal.success}}"
          },
          "prev": ["request-1"],
          "next": ["set-props-1", "set-props-2"]
        },
        "set-props-1": {
          "id": "set-props-1",
          "type": "setElementProps",
          "props": {
            "elementId": "btn-1",
            "props": { "text": "提交成功" }
          },
          "prev": ["condition-1"],
          "next": []
        },
        "set-props-2": {
          "id": "set-props-2",
          "type": "setElementProps",
          "props": {
            "elementId": "btn-1",
            "props": { "text": "提交失败" }
          },
          "prev": ["condition-1"],
          "next": []
        }
      }
    }
  },
  "context": {
    "globalVariables": [
      {
        "name": "userName",
        "description": "当前用户名",
        "type": "string",
        "defaultValue": ""
      },
      {
        "name": "isSubmitting",
        "description": "提交状态",
        "type": "boolean",
        "defaultValue": false
      }
    ]
  },
  "imports": [
    {
      "name": "axios",
      "description": "HTTP 请求库",
      "version": "1.6.0",
      "semverTag": "minor"
    }
  ],
  "extensions": {
    "version": "1.0.0",
    "author": "Tangramino"
  }
}
```

**渲染结果：**

```
root (container)
├── input-1 (input)
└── btn-1 (button) → onClick → flow-submit
```

**流程执行：**

```
点击按钮 → start-1 → request-1（发起请求）→ condition-1（判断结果）
           ├─ 成功 → set-props-1（按钮文字改为"提交成功"）
           └─ 失败 → set-props-2（按钮文字改为"提交失败"）
```

## 设计优势

| 优势           | 说明                                         |
| -------------- | -------------------------------------------- |
| **查找高效**   | 通过 `elements[id]` 实现 O(1) 访问，无需遍历 |
| **更新独立**   | 修改 props 只需更新对应元素，不影响布局结构  |
| **结构灵活**   | 移动/排序元素只需修改 `layout.structure`     |
| **易于序列化** | 纯 JSON，便于存储、传输、版本对比            |
| **逻辑分离**   | 流程编排独立于页面结构，易于维护             |

## 使用场景

### 页面结构定义

使用 `elements` 和 `layout` 定义页面的 UI 结构：

```typescript
const schema: Schema = {
  elements: {
    root: { type: 'page', props: {} },
    header: { type: 'container', props: { className: 'header' } },
    content: { type: 'container', props: { className: 'content' } },
  },
  layout: {
    root: 'root',
    structure: {
      root: ['header', 'content'],
    },
  },
  extensions: {},
};
```

### 逻辑编排

使用 `flows` 和 `bindElements` 定义交互逻辑：

```typescript
// 绑定按钮点击事件到流程
const schema: Schema = {
  elements: {
    /* ... */
  },
  layout: {
    /* ... */
  },
  bindElements: [{ id: 'submit-btn', event: 'onClick', flowId: 'submit-flow' }],
  flows: {
    'submit-flow': {
      startId: 'start',
      nodes: {
        start: {
          id: 'start',
          type: 'start',
          props: {},
          prev: [],
          next: ['validate'],
        },
        validate: {
          id: 'validate',
          type: 'condition',
          props: {},
          prev: ['start'],
          next: ['submit'],
        },
        submit: {
          id: 'submit',
          type: 'interfaceRequest',
          props: {},
          prev: ['validate'],
          next: [],
        },
      },
    },
  },
  extensions: {},
};
```

### 状态管理

使用 `context.globalVariables` 定义全局状态：

```typescript
const schema: Schema = {
  elements: {
    /* ... */
  },
  layout: {
    /* ... */
  },
  context: {
    globalVariables: [
      { name: 'currentUser', description: '当前用户', type: 'object' },
      {
        name: 'theme',
        description: '主题模式',
        type: 'string',
        defaultValue: 'light',
      },
      {
        name: 'loading',
        description: '加载状态',
        type: 'boolean',
        defaultValue: false,
      },
    ],
  },
  extensions: {},
};
```

## Schema 操作

使用 `SchemaUtils` 进行 Schema 操作。所有修改操作都返回包含 `schema` 和 `operation` 的结果对象：

### 基础操作

```typescript
import { SchemaUtils } from '@tangramino/engine';

// 插入元素（作为子元素）
const result = SchemaUtils.insertElement(schema, 'root', {
  type: 'button',
  props: { text: '新按钮' },
});
// result.schema: 更新后的 Schema
// result.operation: { elementId, parentId, index, element }

// 插入元素（指定位置）
const insertResult = SchemaUtils.insertAdjacentElement(
  schema,
  'btn-1',
  { type: 'button', props: { text: '新按钮' } },
  'after', // 'before' | 'after' | 'up' | 'down'
);

// 更新元素属性
const updateResult = SchemaUtils.setElementProps(schema, 'btn-1', {
  text: '更新文本',
  type: 'primary',
});
// updateResult.operation: { elementId, props, oldProps }

// 移动元素
const moveResult = SchemaUtils.moveElement(
  schema,
  'btn-1', // 要移动的元素
  'container-1', // 目标容器
);
// moveResult.operation: { elementId, oldParentId, oldIndex, newParentId, newIndex, mode }

// 删除元素（会同时删除子元素）
const removeResult = SchemaUtils.removeElement(schema, 'btn-1');
// removeResult.operation: { elementId, parentId, index, element }
```

### 查询操作

```typescript
// 获取元素
const element = SchemaUtils.getElementById(schema, 'btn-1');
// → { id: 'btn-1', type: 'button', props: {...} }

// 按类型获取元素
const buttons = SchemaUtils.getElementsByType(schema, 'button');
// → [{ id: 'btn-1', ... }, { id: 'btn-2', ... }]

// 获取父级链（从直接父元素到根节点）
const parents = SchemaUtils.getParents(schema, 'btn-1');
// → ['container-1', 'root']

// 获取子元素
const children = schema.layout.structure['container-1'] || [];
// → ['btn-1', 'input-1']
```

## 最佳实践

### ID 命名规范

使用语义化的 ID 命名，便于理解和维护：

```typescript
// ✅ 推荐
{
  "button-submit": { type: "button", props: { text: "提交" } },
  "input-username": { type: "input", props: { placeholder: "用户名" } },
  "table-users": { type: "table", props: {} }
}

// ❌ 不推荐
{
  "btn1": { type: "button", props: {} },
  "input_1": { type: "input", props: {} },
  "tbl": { type: "table", props: {} }
}
```

### 保持扁平化

避免在 `props` 中嵌套过深的对象：

```typescript
// ✅ 推荐
{
  "props": {
    "title": "标题",
    "config": { "size": "large", "type": "primary" }
  }
}

// ❌ 不推荐（过度嵌套）
{
  "props": {
    "ui": {
      "header": {
        "title": {
          "text": "标题",
          "style": { "color": "red" }
        }
      }
    }
  }
}
```

### 类型一致性

确保 `type` 与注册的物料类型匹配：

```typescript
// 物料注册
const materials = [
  { type: 'customButton', title: '自定义按钮', Component: CustomButton }
];

// Schema 中使用
{
  "elements": {
    "btn-1": {
      "type": "customButton",  // ✅ 与物料 type 一致
      "props": {}
    }
  }
}
```

### 版本管理

在 `extensions` 中存储 Schema 版本信息：

```typescript
{
  "elements": { /* ... */ },
  "layout": { /* ... */ },
  "extensions": {
    "schemaVersion": "2.0.0",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-15T10:30:00Z",
    "author": "developer@example.com"
  }
}
```

### 流程节点命名

为流程节点使用描述性 ID：

```typescript
{
  "flows": {
    "user-login-flow": {
      "startId": "login-start",
      "nodes": {
        "login-start": { /* ... */ },
        "validate-credentials": { /* ... */ },
        "fetch-user-info": { /* ... */ },
        "update-global-state": { /* ... */ }
      }
    }
  }
}
```

### 合理使用 hidden

使用 `hidden` 属性控制元素显示，而不是删除：

```typescript
// ✅ 推荐（可恢复显示）
{
  "modal-1": {
    "type": "modal",
    "props": { title: "对话框" },
    "hidden": true  // 隐藏但保留在 Schema 中
  }
}

// 在流程中切换显示
{
  "type": "setElementProps",
  "props": {
    "elementId": "modal-1",
    "props": { "hidden": false }  // 显示元素
  }
}
```
