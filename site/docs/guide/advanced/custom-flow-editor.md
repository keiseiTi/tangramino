# 自定义流程编辑器

基于 `@tangramino/flow-editor` 构建逻辑编排、工作流设计等场景的流程编辑器。

## 架构概览

```
FlowEditor               // 流程编辑器容器
├── NodePanel            // 左侧节点面板
├── EditorRenderer       // 画布渲染器
│   ├── Nodes            // 节点渲染
│   ├── Edges            // 连线渲染
│   └── Background       // 背景网格
└── ConfigPanel          // 右侧配置面板
```

## 基础用法

```tsx
import React, { useState } from 'react';
import { FlowEditor, EditorRenderer } from '@tangramino/flow-editor';
import { nodes } from './nodes';

const MyFlowEditor = () => {
  const [flowData, setFlowData] = useState(initialData);

  return (
    <FlowEditor
      nodes={nodes}
      value={flowData}
      onChange={setFlowData}
    >
      <div className="flex h-screen">
        {/* 左侧节点面板 */}
        <NodePanel nodes={nodes} />
        
        {/* 画布 */}
        <EditorRenderer className="flex-1" />
        
        {/* 右侧配置面板 */}
        <ConfigPanel />
      </div>
    </FlowEditor>
  );
};
```

## 定义节点

节点是流程图的基本单元，包含元数据、渲染组件和配置表单：

```typescript
import type { FlowNode } from '@tangramino/flow-editor';

export const startNode: FlowNode = {
  type: 'start',
  title: '开始',
  
  nodeMeta: {
    isStart: true,              // 标记为开始节点
    deleteDisable: true,        // 禁止删除
    copyDisable: true,          // 禁止复制
    nodePanelVisible: false,    // 在面板中隐藏
    defaultPorts: [             // 默认端口
      { type: 'output' }
    ],
  },
  
  renderNode: StartNodeRender,  // 渲染组件
  renderForm: StartNodeForm,    // 配置表单
};

export const conditionNode: FlowNode = {
  type: 'condition',
  title: '条件判断',
  
  nodeMeta: {
    defaultPorts: [
      { type: 'input' },
      { type: 'output', label: '是' },
      { type: 'output', label: '否' },
    ],
  },
  
  renderNode: ConditionNodeRender,
  renderForm: ConditionNodeForm,
};

export const actionNode: FlowNode = {
  type: 'action',
  title: '执行动作',
  
  nodeMeta: {
    defaultPorts: [
      { type: 'input' },
      { type: 'output' },
    ],
  },
  
  renderNode: ActionNodeRender,
  renderForm: ActionNodeForm,
};
```

## 节点渲染组件

```tsx
import { Handle, Position } from '@tangramino/flow-editor';

const StartNodeRender = ({ data, selected }) => (
  <div className={`
    px-4 py-2 rounded-full bg-green-500 text-white
    ${selected ? 'ring-2 ring-green-300' : ''}
  `}>
    <span>开始</span>
    <Handle type="source" position={Position.Right} />
  </div>
);

const ConditionNodeRender = ({ data, selected }) => (
  <div className={`
    w-32 h-32 rotate-45 bg-yellow-100 border-2 border-yellow-500
    flex items-center justify-center
    ${selected ? 'ring-2 ring-yellow-300' : ''}
  `}>
    <div className="-rotate-45 text-center">
      <div className="font-medium">{data.title || '条件'}</div>
    </div>
    
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} id="yes" />
    <Handle type="source" position={Position.Bottom} id="no" />
  </div>
);

const ActionNodeRender = ({ data, selected }) => (
  <div className={`
    px-4 py-3 rounded bg-blue-50 border border-blue-300
    ${selected ? 'ring-2 ring-blue-400' : ''}
  `}>
    <div className="font-medium">{data.title || '动作'}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);
```

## 节点配置表单

```tsx
const ConditionNodeForm = ({ data, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium">条件名称</label>
      <input
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        className="mt-1 w-full border rounded px-3 py-2"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium">表达式</label>
      <textarea
        value={data.expression || ''}
        onChange={(e) => onChange({ ...data, expression: e.target.value })}
        className="mt-1 w-full border rounded px-3 py-2 h-24"
        placeholder="例如: value > 100"
      />
    </div>
  </div>
);
```

## 连线控制

通过 `canAddLine` 控制连线规则：

```tsx
const canAddLine = (toPort, fromPort) => {
  // 条件节点最多两条输出连线
  if (fromPort.node.flowNodeType === 'condition') {
    if (fromPort.availableLines.length >= 2) {
      return false;
    }
  }
  
  // 不能连接到自身
  if (toPort.node.id === fromPort.node.id) {
    return false;
  }
  
  // 开始节点不能有输入
  if (toPort.node.flowNodeType === 'start') {
    return false;
  }
  
  return true;
};

<FlowEditor canAddLine={canAddLine} ... />
```

## 连线样式

```tsx
const edgeOptions = {
  type: 'smoothstep',           // 连线类型: default, straight, step, smoothstep
  animated: true,               // 动画效果
  style: {
    stroke: '#3b82f6',
    strokeWidth: 2,
  },
  markerEnd: {
    type: 'arrowclosed',        // 箭头样式
    color: '#3b82f6',
  },
};

<FlowEditor defaultEdgeOptions={edgeOptions} ... />
```

## 画布控制

```tsx
import { useFlowEditor } from '@tangramino/flow-editor';

const Toolbar = () => {
  const { 
    zoomIn, 
    zoomOut, 
    fitView, 
    getNodes,
    addNode 
  } = useFlowEditor();
  
  return (
    <div className="flex gap-2">
      <button onClick={() => zoomIn()}>放大</button>
      <button onClick={() => zoomOut()}>缩小</button>
      <button onClick={() => fitView()}>适应画布</button>
    </div>
  );
};
```

## 插件扩展

```tsx
import { createFreeLinesPlugin } from '@flowgram.ai/free-lines-plugin';

<FlowEditor
  plugins={[
    createFreeLinesPlugin({
      renderInsideLine: ({ edge }) => (
        <div className="px-2 py-1 bg-white border rounded text-xs">
          {edge.label}
        </div>
      ),
    }),
  ]}
  ...
/>
```

## 节点面板

```tsx
const NodePanel = ({ nodes }) => {
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-48 p-4 border-r">
      <h3 className="font-medium mb-3">节点</h3>
      <div className="space-y-2">
        {nodes
          .filter(n => n.nodeMeta?.nodePanelVisible !== false)
          .map(node => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className="p-2 border rounded cursor-grab hover:bg-gray-50"
            >
              {node.title}
            </div>
          ))
        }
      </div>
    </div>
  );
};
```

## 完整示例结构

```
src/flow-editor/
├── index.tsx           # 编辑器入口
├── nodes/
│   ├── index.ts        # 节点导出
│   ├── start.tsx       # 开始节点
│   ├── condition.tsx   # 条件节点
│   └── action.tsx      # 动作节点
├── components/
│   ├── node-panel.tsx  # 节点面板
│   ├── config-panel.tsx
│   └── toolbar.tsx
└── plugins/
    └── validation.ts   # 验证插件
```

## 最佳实践

1. **节点类型**：为不同用途设计专用节点类型
2. **连线验证**：实现完善的 `canAddLine` 逻辑防止非法连接
3. **端口标签**：为多输出端口添加明确标签
4. **错误提示**：连线失败时提供友好的错误提示
5. **撤销重做**：流程编辑支持历史记录
