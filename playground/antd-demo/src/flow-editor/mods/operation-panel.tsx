import React, { useMemo, useState } from 'react';
import { Tree, Tabs, ConfigProvider } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { uniqueId, useEditorCore } from '@tangramino/base-editor';
import { useEditorContext } from '@/hooks/use-editor-context';
import { SchemaUtils } from '@tangramino/engine';
import { NodePanel } from './node-panel';
import type { DataNode } from 'antd/es/tree';
import { useClientContext, type FlowGraphData } from '@tangramino/flow-editor';
import type { FlowNode } from '@tangramino/flow-editor';

interface OperationTreeProps {
  nodes: FlowNode[];
}

export const OperationPanel = (props: OperationTreeProps): JSX.Element => {
  const { nodes } = props;
  const { schema, materials } = useEditorCore();
  const { activeElementEvent, setActiveElementEvent, setFlowGraphData } = useEditorContext();
  const [activeTab, setActiveTab] = useState<string>('tree');
  const clientContext = useClientContext();

  const treeData = useMemo<DataNode[]>(() => {
    const layout = schema.layout;
    const elements = schema.elements;
    const buildTree = (id: string): DataNode | null => {
      const element = elements[id];
      if (!element) return null;
      const material = materials.find((m) => m.type === element.type);
      const title = material?.title || element.type;
      const methods = material?.contextConfig?.methods || [];
      const children: DataNode[] = methods.map((method) => ({
        key: `${id}::${method.name}`,
        title: method.description,
        isLeaf: true,
        data: {
          id,
          method,
          material,
        },
      }));
      const structureChildren = (schema.layout.structure[id] || [])
        .map(buildTree)
        .filter(Boolean) as DataNode[];
      return {
        key: id,
        title,
        children: [...children, ...structureChildren],
      };
    };
    const root = buildTree(layout.root);
    return root ? [root] : [];
  }, [schema, materials]);

  const defaultSelectedKeys = useMemo(() => {
    return activeElementEvent?.elementId
      ? [activeElementEvent?.elementId + '::' + activeElementEvent?.method?.name]
      : treeData?.[0].children?.[0]?.key
        ? [treeData?.[0].children?.[0]?.key]
        : [];
  }, [treeData, activeElementEvent]);

  const onSelect = (keys: React.Key[], info: { node: any }) => {
    const key = String(keys[0] || '');
    if (!key.includes('::')) return;
    const { id, material, method } = info.node.data;
    const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(schema!, key) || {
      nodes: [
        {
          id: 'start_' + uniqueId(undefined, 8),
          type: 'start',
          meta: {
            position: { x: 0, y: 0 },
          },
          data: {},
        },
      ],
      edges: [],
    };
    setActiveElementEvent({
      elementId: id,
      material,
      method: method,
    });
    setTimeout(() => {
      setFlowGraphData(flowGraphData);
      clientContext.operation.fromJSON(flowGraphData);
    });
  };

  return (
    <div className='w-60 border-r border-gray-200 h-full overflow-auto bg-white shadow-sm'>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size='small'
        tabBarStyle={{
          margin: 0,
          padding: '0 6px',
        }}
        items={[
          {
            key: 'tree',
            label: '事件树',
            children: (
              <ConfigProvider
                theme={{
                  components: {
                    Tree: {
                      indentSize: 8,
                    },
                  },
                }}
              >
                <Tree
                  className='p-2!'
                  treeData={treeData}
                  defaultSelectedKeys={defaultSelectedKeys}
                  switcherIcon={<DownOutlined />}
                  onSelect={onSelect}
                  defaultExpandAll
                  height={600}
                  showLine
                />
              </ConfigProvider>
            ),
          },
          {
            key: 'nodes',
            label: '节点面板',
            children: <NodePanel nodes={nodes} />,
          },
        ]}
      />
    </div>
  );
};
