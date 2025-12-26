# Schema 协议

Schema 是 Tangramino 的核心数据结构，用于描述页面结构、状态和逻辑。它是一个标准 JSON 对象，便于存储、传输和版本控制。

## 核心结构

Schema 采用**扁平化设计**，主要由 `elements`（元素集合）和 `layout`（布局关系）两部分组成：

```typescript
interface Schema {
  /** 元素集合（扁平化存储，O(1) 查询） */
  elements: Record<string, ElementState>;

  /** 布局树（父子关系） */
  layout: {
    root: string;                        // 根节点 ID
    structure: Record<string, string[]>; // 父ID → 子ID数组
  };

  /** 流程编排数据（可选） */
  flows?: Record<string, Flow>;

  /** 事件绑定（可选） */
  bindElements?: BindElement[];

  /** 上下文配置（可选） */
  context?: {
    globalVariables?: GlobalVariable[];
  };

  /** 扩展字段（可选） */
  extensions?: Record<string, unknown>;
}
```

## ElementState

描述单个组件实例：

```typescript
interface ElementState {
  type: string;                    // 组件类型（对应 Material.type）
  props: Record<string, unknown>;  // 传递给组件的 props
  hidden?: boolean;                // 是否隐藏
}
```

## 示例

一个包含容器和按钮的简单页面：

```json
{
  "elements": {
    "root": { 
      "type": "container", 
      "props": { "style": { "padding": 20 } } 
    },
    "btn-1": { 
      "type": "button", 
      "props": { "text": "提交", "type": "primary" } 
    },
    "input-1": { 
      "type": "input", 
      "props": { "placeholder": "请输入" } 
    }
  },
  "layout": {
    "root": "root",
    "structure": {
      "root": ["input-1", "btn-1"]
    }
  }
}
```

**渲染结果：**
```
root (container)
├── input-1 (input)
└── btn-1 (button)
```

## 设计优势

| 优势 | 说明 |
|------|------|
| **查找高效** | 通过 `elements[id]` 实现 O(1) 访问，无需遍历 |
| **更新独立** | 修改 props 只需更新对应元素，不影响布局结构 |
| **结构灵活** | 移动/排序元素只需修改 `layout.structure` |
| **易于序列化** | 纯 JSON，便于存储、传输、版本对比 |

## Schema 操作

使用 `SchemaUtils` 进行 Schema 操作：

```typescript
import { SchemaUtils } from '@tangramino/engine';

// 插入元素
const newSchema = SchemaUtils.insertElement(schema, 'root', {
  type: 'button',
  props: { text: '新按钮' }
}, 0);

// 更新属性
const updated = SchemaUtils.setElementProps(schema, 'btn-1', {
  text: '更新文本'
});

// 移动元素
const moved = SchemaUtils.moveElement(schema, 'btn-1', 'container-1', 0);

// 删除元素
const removed = SchemaUtils.removeElement(schema, 'btn-1');

// 获取父级链
const parents = SchemaUtils.getParents(schema, 'btn-1');
// → ['root']
```

## 全局变量

定义应用级变量，可在流程编排中使用：

```typescript
interface GlobalVariable {
  name: string;
  description: string;
  type?: 'string' | 'number' | 'boolean';
  defaultValue?: string | boolean | number;
}
```

```json
{
  "context": {
    "globalVariables": [
      { "name": "userName", "description": "当前用户", "defaultValue": "" },
      { "name": "isLoggedIn", "description": "登录状态", "defaultValue": false }
    ]
  }
}
```

## 最佳实践

1. **ID 命名规范**：使用 `type-uuid` 格式，如 `button-abc123`
2. **保持扁平**：避免在 `props` 中嵌套过深的对象
3. **类型一致**：确保 `type` 与注册的物料类型匹配
4. **版本管理**：可在 `extensions` 中存储 Schema 版本号
