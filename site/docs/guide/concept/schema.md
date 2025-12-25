# Schema 协议

Schema 是 Tangramino 中描述页面结构、状态和逻辑的核心数据结构。它是一个标准的 JSON 对象，便于存储和传输。

## 数据结构

Schema 主要由 `elements`（元素集合）和 `layout`（布局关系）两部分组成，实现了数据存储的扁平化。

```typescript
export interface Schema {
  /**
   * 元素集合 (扁平化存储)
   * Key 为元素 ID，Value 为元素状态对象
   */
  elements: Record<string, ElementState>;

  /**
   * 布局树
   * 定义元素的层级嵌套关系
   */
  layout: {
    /** 根节点 ID */
    root: string;
    /** 
     * 结构映射表
     * Key 为父节点 ID，Value 为子节点 ID 数组 
     */
    structure: Record<string, string[]>;
  };

  /**
   * 流程编排数据
   * 存储流程图的节点和连线信息
   */
  flows?: Record<string, Flow>;

  /**
   * 事件绑定关系
   * 定义组件事件触发哪个流程
   */
  bindElements?: BindElement[];

  /**
   * 上下文配置
   * 如全局变量定义
   */
  context?: {
    globalVariables?: GlobalVariable[];
  };

  /**
   * 扩展字段
   * 用于存储插件或其他自定义数据
   */
  extensions?: Record<string, unknown>;
}
```

## 核心定义

### ElementState

描述单个组件实例的状态和属性。

```typescript
export interface ElementState {
  /** 
   * 元素类型 (对应 Material.type) 
   */
  type: string;

  /** 
   * 组件属性 
   * 将直接传递给 React 组件的 props
   */
  props: Record<string, unknown>;

  /** 
   * 是否隐藏
   */
  hidden?: boolean;
}
```

### GlobalVariable

定义应用级的全局变量。

```typescript
export interface GlobalVariable {
  name: string;
  description: string;
  type?: string;
  defaultValue?: string | boolean | number;
}
```

## 示例

一个包含容器和按钮的简单页面 Schema：

```json
{
  "elements": {
    "root": { 
      "type": "container", 
      "props": { "style": { "padding": 20 } } 
    },
    "btn_1": { 
      "type": "button", 
      "props": { "text": "提交", "type": "primary" } 
    }
  },
  "layout": {
    "root": "root",
    "structure": {
      "root": ["btn_1"]
    }
  }
}
```

## 设计优势

1.  **查找高效**：通过 `elements` 映射表，可以在 O(1) 时间复杂度内访问任意元素，无需遍历树。
2.  **更新独立**：修改某个元素的 `props` 只需更新 `elements` 中的对应项，不会影响布局结构，有利于 React 的性能优化。
3.  **结构灵活**：通过修改 `layout.structure` 即可轻松实现元素的移动、重新排序，而无需操作元素本身的数据。