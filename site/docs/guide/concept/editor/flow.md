# 事件流程编辑器

事件流程编辑器用于编排组件的交互逻辑。它读取物料的 `contextConfig` 来决定哪些事件可以被监听，哪些状态和方法可以被使用。

## 上下文配置 (Context Config)

`contextConfig` 是物料与流程编辑器之间的契约。

```typescript
// playground/antd-demo/src/materials/input/material-config.ts
contextConfig: {
  variables: [
    { name: 'value', description: '当前值' },
    { name: 'disabled', description: '是否禁用' },
  ],
  methods: [
    {
      name: 'onChange', // 可作为事件绑定
      description: '值改变时的回调',
      params: [{ description: '事件参数' }],
    },
    {
      name: 'setValue', // 可Í作为动作调用（假设有此方法）
      description: '设置值',
    }
  ],
}
```

- **variables**: 定义了组件对外暴露的状态。在流程编辑器中，这些变量可以被其他节点引用（例如作为条件判断的依据）。
- **methods**: 定义了组件的方法。
  - **作为事件**：用户可以将 `onChange` 拖拽为流程的触发器（Start Node）。
  - **作为动作**：用户可以使用 `EmitElementAction` 节点来调用这些方法。

## 节点类型

流程编辑器内置了多种逻辑节点，用于构建复杂的业务流：

1.  **Start Node (触发节点)**: 对应物料的事件（如 `onClick`, `onChange`）。
2.  **Condition (条件判断)**: 根据表达式或变量值分流执行路径。
3.  **SetElementProps (设置属性)**: 修改组件的属性（如 `hidden`, `style`），这会触发 `engine.setState`。
4.  **EmitElementAction (触发动作)**: 调用组件暴露的方法（通过 `engine.contextValues`）。
5.  **CustomJS (自定义代码)**: 执行一段 JavaScript 代码，用于处理复杂的数据转换。
6.  **InterfaceRequest (接口请求)**: 发起 HTTP 请求。

## 数据流转

在编辑器中配置节点属性时，支持使用 **HyperValue**（一种动态值类型）。用户可以选择：

- **静态值**: 字符串、数字、布尔值。
- **上下文值 (Context Value)**: 绑定到某个组件的变量（如 `Form.value`）。
- **表达式**: 使用简单的 JS 表达式进行计算。

例如，在“设置属性”节点中，可以将某个 Input 的 `value` 赋值给另一个 Text 组件的 `content` 属性，从而实现数据联动。
