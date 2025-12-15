import React, { useMemo, useState } from 'react';
import { Tree, Tabs, ConfigProvider } from 'antd';
import { CloseOutlined, RocketOutlined, DownOutlined } from '@ant-design/icons';
import { useEditorCore, type ActiveElement, type Material } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { cn } from '@/utils/cn';
import { MaterialPanel } from './material-panel';
import type { DataNode } from 'antd/es/tree';
import { isPortal } from '@/utils';

interface RightPanelProps {
  materialGroups: { title: string; children: Material[] }[];
}

export const RightPanel = ({ materialGroups }: RightPanelProps): JSX.Element => {
  const { schema, materials, engine, activeElement, setActiveElement } = useEditorCore();
  const [hidden, setHidden] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('materials');

  const outlineTree = useMemo<DataNode[]>(() => {
    const { layout, elements } = schema;
    const buildNode = (id: string): DataNode | null => {
      const element = elements[id];
      if (!element) return null;
      const material = materials.find((m) => m.type === element.type);
      const title = material?.title || element.type;
      const parentIds = SchemaUtils.getParents(schema, id);
      const parents: ActiveElement[] = parentIds
        .map((pid) => {
          const pel = elements[pid];
          if (!pel) return null;
          const pm = materials.find((mm) => mm.type === pel.type);
          if (!pm) return null;
          return { id: pid, type: pel.type, props: pel.props || {}, material: pm } as ActiveElement;
        })
        .filter(Boolean) as ActiveElement[];
      const children = (layout.structure[id] || []).map(buildNode).filter(Boolean) as DataNode[];
      return {
        key: id,
        title,
        children,
        data: {
          id,
          type: element.type,
          props: element.props || {},
          material,
          parents,
        },
      } as DataNode;
    };
    const root = buildNode(layout.root);
    return root ? [root] : [];
  }, [schema, materials]);

  const onSelect = (_: React.Key[], info: { node: any }) => {
    const data = info?.node?.data as ActiveElement | undefined;
    if (!data?.id || !data?.material) return;
    if (isPortal(activeElement?.type || '')) {
      engine.setState({
        [activeElement!.id]: {
          open: false,
        },
      });
    }
    if (isPortal(data.type)) {
      engine.setState({
        [data.id]: {
          open: true,
          getContainer: false,
        },
      });
    }
    setActiveElement(data);
  };

  return (
    <>
      <div
        className={cn(
          'absolute top-0 -left-0.5 z-300 cursor-pointer text-gray-600 hover:text-blue-600',
          {
            block: hidden,
            hidden: !hidden,
          },
        )}
      >
        <RocketOutlined onClick={() => setHidden(false)} />
      </div>
      <div
        className={cn('w-60 border-r border-gray-200 h-full bg-white', {
          hidden: hidden,
        })}
      >
        <div className='px-3 flex items-center justify-between border-b border-gray-200'>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarStyle={{
              margin: 0,
            }}
            size='small'
            items={[
              { key: 'materials', label: '物料' },
              { key: 'outline', label: '大纲树' },
            ]}
          />
          <div className='flex items-center space-x-2'>
            <CloseOutlined onClick={() => setHidden(true)} className='text-gray-600' />
          </div>
        </div>
        {activeTab === 'materials' ? (
          <MaterialPanel materialGroups={materialGroups} />
        ) : (
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
              treeData={outlineTree}
              onSelect={onSelect}
              switcherIcon={<DownOutlined />}
              showLine
              defaultExpandAll
              height={600}
            />
          </ConfigProvider>
        )}
      </div>
    </>
  );
};
