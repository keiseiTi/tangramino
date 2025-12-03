# Schema 协议

Tangramino 的核心是 Schema。它定义了整个页面的结构、属性、样式以及逻辑关联。理解 Schema 是使用 Tangramino 的基础。

## 结构定义

一个完整的 Schema 对象包含以下几个核心部分：

```typescript
export interface Schema {
  /**
   * 页面元数据
   * 包含页面的基本信息，如标题、描述、创建时间等
   */
  meta?: Record<string, unknown>;

  /**
   * 元素集合 (扁平化存储)
   * Key 为元素 ID，Value 为元素对象
   */
  elements: Record<string, Element>;

  /**
   * 布局树
   * 定义了元素之间的父子嵌套关系
   */
  layout: {
    /** 根节点 ID */
    root: string;
    /** 父子关系映射: parentId -> childIds[] */
    structure: Record<string, string[]>;
  };

  /**
   * 扩展数据
   * 用于存储全局变量、数据源配置等
   */
  extensions?: Record<string, unknown>;
}
```

## Element 元素

Element 是 Schema 中的最小单元，对应一个 UI 组件实例。

```typescript
export interface Element {
  /** 元素唯一 ID */
  id: string;

  /** 元素类型 (对应注册的物料 type) */
  type: string;

  /** 
   * 元素属性 
   * 直接透传给 React 组件的 props
   */
  props: Record<string, unknown>;

  /** 样式对象 (React.CSSProperties) */
  style?: Record<string, unknown>;

  /** CSS 类名 */
  className?: string;
  
  /** 是否隐藏 */
  hidden?: boolean;

  /** 
   * 绑定的流程图数据
   * 用于描述该元素的交互逻辑
   */
  flow?: FlowData;
}
```

## 设计理念

### 扁平化存储 vs 树形存储

Tangramino 选择了 **扁平化存储 (`elements` 映射表)** 配合 **关系映射 (`layout.structure`)** 的方式，而不是直接使用树形结构。

**优点：**

1.  **查找效率高**：通过 ID 可以 O(1) 复杂度直接获取任意元素，无需遍历树。
2.  **更新性能好**：修改某个深层节点时，不需要重建整个树结构，利于 React 的不可变数据更新。
3.  **移动操作简便**：移动元素只需修改 `layout.structure` 中的引用，无需进行复杂的节点摘除和插入操作。

### 视图与逻辑分离

Schema 只描述"是什么"（UI 结构）和"有什么"（数据），而不包含具体的执行代码。具体的渲染逻辑由 `@tangramino/react` 处理，交互逻辑由 `@tangramino/flow-editor` 或自定义逻辑处理。这种分离使得 Schema 可以被序列化、存储并在不同端（Web、Mobile 等）复用。
