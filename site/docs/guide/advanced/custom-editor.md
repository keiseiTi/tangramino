# 自定义编辑器

基于 `@tangramino/base-editor` 构建功能完备的可视化编辑器。

## 架构概览

```
EditorProvider           // 全局状态管理
├── Operation            // 顶部操作栏
├── Sidebar              // 左侧面板（物料、大纲）
├── MainContent          // 主内容区
│   ├── CanvasEditor     // 核心画布
│   └── AttributePanel   // 属性面板
└── DragOverlay          // 拖拽预览层
```

## 基础框架

```tsx
import React from 'react';
import {
  EditorProvider,
  DragOverlay,
  useEditorCore,
} from '@tangramino/base-editor';

const Editor = () => {
  const { dragElement } = useEditorCore();

  return (
    <EditorProvider materials={materials} schema={initialSchema} plugins={[]}>
      <div className="flex flex-col h-screen">
        {/* 顶部操作栏 */}
        <header className="h-12 border-b">
          <Operation />
        </header>

        {/* 主体区域 */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>

      {/* 拖拽预览 */}
      <DragOverlay>
        <div className="px-3 py-1 bg-white border rounded shadow">
          {dragElement?.title}
        </div>
      </DragOverlay>
    </EditorProvider>
  );
};
```

## 画布区域

```tsx
import { CanvasEditor } from '@tangramino/base-editor';

const MainContent = () => {
  return (
    <div className="flex flex-1">
      {/* 画布 */}
      <div className="flex-1 p-4 overflow-auto">
        <CanvasEditor
          className="min-h-full bg-white border"
          renderElement={renderCustomElement}
          renderDropIndicator={renderDropIndicator}
        />
      </div>

      {/* 属性面板 */}
      <AttributePanel className="w-72 border-l" />
    </div>
  );
};
```

## 自定义元素渲染

通过 `renderElement` 控制画布中元素的渲染方式：

```tsx
import type { EnhancedComponentProps } from '@tangramino/base-editor';

const renderCustomElement = (props: EnhancedComponentProps) => {
  const { children, elementProps, element, isActive } = props;

  return (
    <div
      {...elementProps}
      className={`
        relative group
        ${isActive ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {children}

      {/* 选中时显示操作按钮 */}
      {isActive && (
        <div className="absolute -top-8 left-0 flex gap-1">
          <button onClick={() => handleCopy(element)}>复制</button>
          <button onClick={() => handleDelete(element)}>删除</button>
        </div>
      )}
    </div>
  );
};
```

## 自定义拖放指示器

```tsx
const renderDropIndicator = (props) => {
  const { position, direction } = props;

  const style = {
    position: 'absolute',
    backgroundColor: '#3b82f6',
    ...(direction === 'horizontal'
      ? { height: 2, width: '100%', top: position }
      : { width: 2, height: '100%', left: position }),
  };

  return <div style={style} />;
};
```

## 侧边栏

```tsx
import {
  useEditorContext,
  MaterialPanel,
  OutlineTree,
} from '@tangramino/base-editor';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('material');

  return (
    <aside className="w-64 border-r bg-gray-50">
      {/* Tab 切换 */}
      <nav className="flex border-b">
        <button
          className={activeTab === 'material' ? 'active' : ''}
          onClick={() => setActiveTab('material')}
        >
          物料
        </button>
        <button
          className={activeTab === 'outline' ? 'active' : ''}
          onClick={() => setActiveTab('outline')}
        >
          大纲
        </button>
      </nav>

      {/* 面板内容 */}
      <div className="p-3">
        {activeTab === 'material' && <MaterialPanel groups={materialGroups} />}
        {activeTab === 'outline' && <OutlineTree />}
      </div>
    </aside>
  );
};
```

## 属性面板

利用物料的 `editorConfig` 自动生成：

```tsx
import { useActiveElement, AttributeForm } from '@tangramino/base-editor';

const AttributePanel = () => {
  const { activeElement, activeMaterial } = useActiveElement();

  if (!activeElement) {
    return <div className="p-4 text-gray-400">请选择元素</div>;
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-3">{activeMaterial?.title}</h3>
      <AttributeForm
        element={activeElement}
        config={activeMaterial?.editorConfig}
      />
    </div>
  );
};
```

## 操作栏

```tsx
import { useHistory, useSchema } from '@tangramino/base-editor';

const Operation = () => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { schema, exportSchema, importSchema } = useSchema();

  const handleSave = () => {
    const data = exportSchema();
    console.log('保存:', JSON.stringify(data));
  };

  return (
    <div className="flex items-center gap-2 px-4 h-full">
      <button disabled={!canUndo} onClick={undo}>
        撤销
      </button>
      <button disabled={!canRedo} onClick={redo}>
        重做
      </button>
      <button onClick={handleSave}>保存</button>
      <button onClick={() => window.open('/preview')}>预览</button>
    </div>
  );
};
```

## 完整示例结构

```
src/editor/
├── index.tsx           # 编辑器入口
├── materials/          # 物料定义
│   ├── index.ts
│   ├── button.ts
│   └── input.ts
├── components/
│   ├── operation.tsx   # 操作栏
│   ├── sidebar.tsx     # 侧边栏
│   ├── main-content.tsx
│   └── attribute-panel.tsx
└── plugins/            # 自定义插件
    └── auto-save.ts
```

## 最佳实践

1. **状态管理**：利用 `EditorProvider` 统一管理，避免外部状态
2. **性能优化**：大型画布使用虚拟滚动
3. **错误边界**：为画布和属性面板添加错误边界
4. **响应式**：考虑不同屏幕尺寸的布局适配
