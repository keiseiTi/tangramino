# 视图渲染引擎

视图渲染引擎负责将 Schema 描述的页面结构转换为用户可见的 React 组件树。它是 Tangramino 运行时的核心部分。

## 工作流程

渲染引擎通过 `ReactView` 组件接收 `engine` 实例，并监听引擎的 `VIEW_UPDATE` 和 `ELEMENT_UPDATE` 事件来实现响应式渲染。

### 1. 组件包装 (HOC)

引擎并不会直接渲染物料组件，而是通过 `HocComponent` 进行包装。这个高阶组件负责：

- **属性透传**：将 Schema 中的 `props` (`data`) 透传给业务组件。
- **事件注入**：将 `engine.injectionCallback` 中注册的事件监听器注入为组件 props。
- **错误边界**：提供 `ErrorBoundary` 以防止单个组件崩溃导致页面白屏。

```tsx
// packages/react/src/components/hoc.tsx
const Component = (props) => {
  const { data, ... } = props;
  // 获取注入的事件回调
  const callbacks = engine.injectionCallback[id];
  // ...
  return (
    <Comp {...composeEvent} {...data}>
      {children}
    </Comp>
  );
};
```

### 2. 属性注入机制

组件接收到的属性来源主要有两部分：

1.  **Schema Props**: 在 Schema 中定义的静态属性。
2.  **Runtime State**: 通过 `engine.setState` 更新的动态属性。
3.  **Plugins**: 插件注入的特殊属性。

例如，`contextValuePlugin` 会向所有组件注入 `tg_setContextValues` 方法，用于组件向引擎同步状态或注册方法。

```typescript
// packages/base-editor/src/plugins/context-value.ts
engine.setState({
  [id]: {
    tg_setContextValues: (value) => { ... }
  }
});
```

### 3. 递归渲染

`ReactView` 遍历 `layout` 树，根据节点的 `id` 查找对应的 Element 和 Component 进行渲染。如果节点包含 `children`，则递归渲染子节点。

```tsx
// packages/react/src/view.tsx
const render = (nodes: LayoutNode[]) => {
  return nodes.map((node) => {
    const element = elements[node.id];
    // ...
    return (
      <Component key={node.id} data={element.props}>
        {render(node.children)}
      </Component>
    );
  });
};
```

## 示例：Form 组件渲染

以 `Form` 组件为例，它在运行时会接收到如下属性：

```tsx
export const Form = (props: IProps) => {
  const {
    children,
    // 1. Schema 中定义的属性
    labelColVal,
    // 2. 插件注入的方法，用于同步状态
    tg_setContextValues,
    // 3. 如果绑定了事件，会接收到对应的回调
    // onValuesChange,
    ...restProps
  } = props;

  // ...
};
```
