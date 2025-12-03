# 自定义流程编辑器

Tangramino 的流程编辑器基于 `@tangramino/flow-editor`，支持节点定义、连线逻辑、自由画布等特性，适用于逻辑编排、工作流设计等场景。

## 基础用法

使用 `FlowEditor` 组件并传入节点定义和数据即可。

```tsx
import React from 'react';
import { FlowEditor as BaseFlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import { nodes } from './nodes';

const FlowEditor = () => {
  const [flowData, setFlowData] = useState(initialData);

  return (
    <BaseFlowEditor
      nodes={nodes}
      value={flowData}
      onChange={setFlowData}
    >
      <div className='flex h-full'>
        {/* 左侧节点面板 */}
        <div className='flex flex-col h-full'>
          <OperationPanel nodes={nodes} />
        </div>
        
        {/* 画布区域 */}
        <div className='flex-1 flex flex-col'>
          <EditorRenderer className='flex-1 relative' />
        </div>
        
        {/* 右侧属性面板 */}
        <AttributePanel />
      </div>
    </BaseFlowEditor>
  );
};
```

## 定义节点

节点是流程图的基本单元。你需要定义节点的元数据（Meta）、渲染组件（Render）和配置表单（Form）。

```typescript
import type { FlowNode } from '@tangramino/flow-editor';
import { NodeRender } from './node-render';
import { FormConfig } from './form-config';

export const startNode: FlowNode = {
  type: 'start',
  title: '开始',
  nodeMeta: {
    // 是否为开始节点
    isStart: true,
    // 禁止删除
    deleteDisable: true,
    // 禁止复制
    copyDisable: true,
    // 在节点面板中隐藏
    nodePanelVisible: false,
    // 默认端口配置
    defaultPorts: [{ type: 'output' }],
  },
  // 节点渲染组件
  renderNode: NodeRender,
  // 节点配置表单
  renderForm: FormConfig,
};
```

### 节点渲染组件

你可以完全自定义节点的外观。

```tsx
import React from 'react';
import { Handle } from '@tangramino/flow-editor';

export const NodeRender = ({ data }) => {
  return (
    <div className="custom-node">
      <div className="title">{data.title}</div>
      {/* 输出端口 */}
      <Handle type="source" position="right" />
    </div>
  );
};
```

## 连线控制

通过 `canAddLine` 属性可以控制连线规则。

```tsx
const canAddLine = (toPort, fromPort) => {
  // 条件节点最多两条连线
  if (fromPort.node.flowNodeType === 'condition') {
    if (fromPort.availableLines.length >= 2) {
      return false;
    }
  } 
  // 动作节点不能作为起点
  else if (fromPort.node.flowNodeType === 'action') {
    return false;
  }
  return true;
};

<BaseFlowEditor canAddLine={canAddLine} ... />
```

## 插件扩展

流程编辑器也支持插件，例如 `createFreeLinesPlugin` 可以支持自由连线。

```tsx
import { createFreeLinesPlugin } from '@flowgram.ai/free-lines-plugin';

<BaseFlowEditor
  plugins={[
    createFreeLinesPlugin({
      renderInsideLine: CustomLineLabel,
    }),
  ]}
  ...
/>
```

通过组合这些能力，你可以构建出复杂的逻辑编排界面。
