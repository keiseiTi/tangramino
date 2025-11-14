import React, { useEffect, useMemo } from 'react';
import {
  AppstoreOutlined,
  CodeOutlined,
  DatabaseOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { useEditorContext, type LeftPanel } from '@/hooks/use-editor-context';
import { cn } from '@/utils';

export const Sidebar = () => {
  const { leftPanel, setLeftPanel, setMode } = useEditorContext();

  const sidebarItems = useMemo(
    () => [
      { key: 'view' as const, label: '视图搭建', icon: <AppstoreOutlined /> },
      { key: 'logic' as const, label: '逻辑编辑', icon: <BranchesOutlined /> },
      { key: 'schema' as const, label: 'Schema', icon: <CodeOutlined /> },
      { key: 'globals' as const, label: '全局变量', icon: <DatabaseOutlined /> },
    ],
    [],
  );
  const onLeftPanelChange = (leftPanelKey: LeftPanel) => {
    setLeftPanel(leftPanelKey);
    if (leftPanelKey === 'view' || leftPanelKey === 'logic') {
      setMode(leftPanelKey);
    }
  };

  return (
    <div className='w-14 h-full border-r border-gray-200 bg-white'>
      <div className='flex flex-col items-center py-2 space-y-2'>
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            type='button'
            className={cn(
              'w-12 h-12 flex flex-col items-center justify-center rounded-md text-gray-700 hover:bg-gray-100',
              {
                'bg-gray-100! text-blue-600 border border-blue-200': leftPanel === item.key,
              },
            )}
            onClick={onLeftPanelChange.bind(this, item.key)}
          >
            <span className='text-lg'>{item.icon}</span>
            <span className='text-[10px] mt-0.5'>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
