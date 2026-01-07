# Flow Editor

`@tangramino/flow-editor` 提供流程编辑器能力，用于构建可视化的逻辑流程图。基于 `@flowgram.ai/free-layout-editor` 构建。

## 安装

```bash
npm install @tangramino/flow-editor
# 或
pnpm add @tangramino/flow-editor
```

## FlowEditor

流程编辑器主组件，提供完整的流程图编辑能力。

```tsx
import { FlowEditor } from '@tangramino/flow-editor';

<FlowEditor
  nodes={nodeDefinitions}
  value={flowData}
  onChange={(data) => setFlowData(data)}
  readonly={false}
>
  <NodePanel />
  <AttributePanel />
</FlowEditor>;
```

### Props

| 属性          | 类型                               | 必填 | 说明                       |
| ------------- | ---------------------------------- | ---- | -------------------------- |
| nodes         | `FlowNode[]`                       | 否   | 节点定义数组               |
| value         | `FlowGraphData`                    | 否   | 流程图数据                 |
| onChange      | `(data: FlowGraphData) => void`    | 否   | 数据变化回调               |
| readonly      | `boolean`                          | 否   | 是否只读模式，默认 `false` |
| children      | `React.ReactNode`                  | 否   | 子组件（如面板）           |
| canAddLine    | `FreeLayoutProps['canAddLine']`    | 否   | 是否允许添加连线           |
| canDeleteNode | `FreeLayoutProps['canDeleteNode']` | 否   | 是否允许删除节点           |
| canDeleteLine | `FreeLayoutProps['canDeleteLine']` | 否   | 是否允许删除连线           |
| canResetLine  | `FreeLayoutProps['canResetLine']`  | 否   | 是否允许重置连线           |
| canDropToNode | `FreeLayoutProps['canDropToNode']` | 否   | 是否允许拖拽到节点         |
| plugins       | `Plugin[]`                         | 否   | 流程编辑器插件             |

## FlowNode

流程节点定义接口。

```typescript
interface FlowNode {
  // 节点类型
  type: string;
  // 节点标题
  title: string;
  // 节点元数据
  nodeMeta?: Partial<WorkflowNodeMeta>;
  // 节点渲染
  renderNode?: () => React.ReactElement;
  // 节点表单渲染
  renderForm?: <T>(props: T) => React.ReactElement;
  // 流程逻辑执行函数
  flowLogic?: <T>(ctx: T) => Promise<unknown> | unknown;
  // 节点默认属性
  defaultProps?: Record<string, unknown>;
}
```

### FlowNode 示例

```tsx
const conditionNode: FlowNode = {
  type: 'condition',
  title: '条件判断',
  nodeMeta: {
    defaultExpanded: true,
  },
  defaultProps: {
    condition: '',
    trueLabel: '是',
    falseLabel: '否',
  },
  renderNode: () => (
    <div className="condition-node">
      <ConditionIcon />
      <span>条件判断</span>
    </div>
  ),
  renderForm: ({ data, updateData }) => (
    <ConditionForm
      value={data.condition}
      onChange={(v) => updateData({ condition: v })}
    />
  ),
  flowLogic: async (ctx) => {
    const { data, outputs } = ctx;
    const result = evaluateCondition(data.condition);
    return result ? outputs.true : outputs.false;
  },
};
```

## FlowGraphData

流程图数据结构。

```typescript
interface FlowGraphData {
  nodes: WorkflowNodeJSON[];
  edges: WorkflowEdgeJSON[];
}
```

## useEditorContext

获取流程编辑器上下文。

```tsx
import { useEditorContext } from '@tangramino/flow-editor';

function AttributePanel() {
  const { activeNode, nodes, setActiveNode } = useEditorContext();

  if (!activeNode) {
    return <div>请选择节点</div>;
  }

  return (
    <div>
      <h3>{activeNode.title}</h3>
      {activeNode.renderForm && activeNode.renderForm()}
    </div>
  );
}
```

### 返回值

| 属性          | 类型                         | 说明           |
| ------------- | ---------------------------- | -------------- |
| activeNode    | `ActiveNode \| null`         | 当前激活的节点 |
| nodes         | `FlowNode[]`                 | 所有节点定义   |
| setActiveNode | `(node: ActiveNode) => void` | 设置激活节点   |

### ActiveNode 类型

```typescript
interface ActiveNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
  title: string | null;
  renderForm: () => React.ReactNode;
  updateData: (data: Record<string, unknown>) => void;
}
```

## useNodeContext

获取当前节点渲染上下文（在节点组件内部使用）。

```tsx
import { useNodeContext } from '@tangramino/flow-editor';

function MyNodeComponent() {
  const { id, type, data, form, updateData, selected } = useNodeContext();

  return (
    <div className={selected ? 'selected' : ''}>
      <h4>{data.title}</h4>
      {form?.render()}
    </div>
  );
}
```

### 返回值

| 属性       | 类型                                      | 说明         |
| ---------- | ----------------------------------------- | ------------ |
| id         | `string`                                  | 节点 ID      |
| type       | `string`                                  | 节点类型     |
| data       | `Record<string, unknown>`                 | 节点数据     |
| form       | `object`                                  | 表单对象     |
| updateData | `(data: Record<string, unknown>) => void` | 更新节点数据 |
| selected   | `boolean`                                 | 是否被选中   |

## useClientContext

获取流程编辑器客户端上下文。

```tsx
import { useClientContext } from '@tangramino/flow-editor';

function ToolBar() {
  const ctx = useClientContext();

  const handleZoomIn = () => {
    ctx.tools.zoomIn();
  };

  const handleFitView = () => {
    ctx.tools.fitView();
  };

  return (
    <div className="toolbar">
      <button onClick={handleZoomIn}>放大</button>
      <button onClick={handleFitView}>适应视图</button>
    </div>
  );
}
```

## BaseNode

基础节点渲染组件，FlowEditor 内部使用。自定义节点时可参考其实现。

```tsx
import { BaseNode } from '@tangramino/flow-editor';

// BaseNode 会自动处理：
// - 节点选中状态
// - 节点数据更新
// - 表单渲染
// - 与 EditorContext 的同步
```

## 控制函数属性

### canAddLine

控制是否允许添加连线。

```tsx
<FlowEditor
  canAddLine={(ctx, fromPort, toPort) => {
    // 禁止自连接
    if (fromPort.node === toPort.node) {
      return false;
    }
    // 禁止从输入端口连接
    if (fromPort.type === 'input') {
      return false;
    }
    return true;
  }}
/>
```

### canDeleteNode

控制是否允许删除节点。

```tsx
<FlowEditor
  canDeleteNode={(ctx, node) => {
    // 禁止删除开始节点
    if (node.type === 'start') {
      return false;
    }
    return true;
  }}
/>
```

### canDeleteLine

控制是否允许删除连线。

```tsx
<FlowEditor
  canDeleteLine={(ctx, edge) => {
    // 禁止删除主流程连线
    if (edge.data?.isMainFlow) {
      return false;
    }
    return true;
  }}
/>
```

## 样式导入

使用 FlowEditor 时需要导入基础样式：

```tsx
import '@flowgram.ai/free-layout-editor/index.css';
```

或者在 FlowEditor 组件中已自动导入，无需额外操作。
