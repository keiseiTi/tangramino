# 事件流程引擎

事件流程引擎负责在运行时执行由流程编辑器编排的业务逻辑。它通过 `withFlowEngine` 扩展引擎能力，处理事件绑定、逻辑执行和上下文管理。

## 事件监听与触发

引擎通过 `injectCallback` 机制，将事件监听器注入到组件中。

### 1. 事件绑定

在 Schema 中，`bindElements` 字段定义了组件事件与流程的绑定关系：

```json
"bindElements": [
  {
    "id": "input_1",
    "event": "onChange", // 对应组件 props 中的 onChange
    "flowId": "flow_1"
  }
]
```

引擎在初始化时，会生成一个回调函数，并通过 `injectionCallback` 传递给组件。

### 2. 流程执行

当组件触发事件（如用户输入触发 `onChange`）时，注入的回调函数被执行，进而启动对应的逻辑流。

> **注意**：目前的引擎实现中，事件回调接收到的参数（如 `event` 对象）**不会**直接传递给逻辑节点。逻辑节点主要依赖 `engine.contextValues` 获取状态。

## 上下文交互

流程引擎维护了一个全局的 `contextValues`，用于存储组件状态、方法和全局变量。

### 状态同步 (State Sync)

由于流程节点无法直接获取事件参数，组件必须主动将关键状态同步到引擎的 `contextValues` 中，以便流程节点读取。

这通常通过 `tg_setContextValues` 实现（由插件注入）：

```tsx
// playground/antd-demo/src/materials/form/index.tsx
export const Form = (props: IProps) => {
  const { tg_setContextValues } = props;
  const [form] = AntdForm.useForm();

  // 监听表单值变化，并同步到引擎上下文
  const onValuesChange = (_, allValues) => {
    tg_setContextValues?.({
      value: allValues, // 流程节点可以通过 contextValue 读取 'form_id.value'
    });
  };

  return <AntdForm onValuesChange={onValuesChange} ... />;
};
```

### 方法注册 (Method Registration)

组件还可以将自身的方法暴露给引擎，供 `emitElementAction` 节点调用。

```tsx
// playground/antd-demo/src/materials/form/index.tsx
useEffect(() => {
  tg_setContextValues?.({
    setFieldsValue: form.setFieldsValue, // 供流程调用
    resetFields: form.resetFields,
  });
}, [form]);
```

## 逻辑节点执行

流程中的每个节点（如 `condition`, `customJS`）执行时，都会接收到一个上下文对象 `ctx`：

```typescript
const ctx = {
  engine, // 访问引擎能力 (getState, getContextValue, setState)
  data: eventNode.props, // 节点配置的属性
  lastReturnedVal, // 上一个节点的返回值
};
```

节点通过 `executeHyperValue` 工具函数，可以动态解析配置中的变量（引用自 `contextValues` 或 `globalVariables`）。
