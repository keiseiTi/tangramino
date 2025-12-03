# 自定义编辑器

Tangramino 提供了高度灵活的编辑器构建能力，你可以基于 `@tangramino/base-editor` 快速搭建一个功能完备的可视化编辑器。

## 基础结构

编辑器的核心组件是 `EditorProvider`，它负责管理全局状态、Schema、物料和插件。

```tsx
import React from 'react';
import { EditorProvider, DragOverlay, useEditorCore } from '@tangramino/base-editor';
import { Operation } from './mods/operation';
import { Sidebar } from './mods/sidebar';
import { MainContent } from './mods/main-content';
import { materialGroups } from './materials';
import { defaultSchema } from './constant';

const EditorPage = () => {
  const { dragElement } = useEditorCore();

  return (
    <EditorProvider
      materials={materialGroups.flatMap((group) => group.children)}
      schema={defaultSchema}
      plugins={[]}
    >
      <div className='flex flex-col w-full h-screen min-w-[1080px] bg-gray-50'>
        {/* 顶部操作栏 */}
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200'>
          <Operation />
        </div>
        
        <div className='flex-1 overflow-hidden'>
          <div className='flex h-full w-full'>
            {/* 左侧侧边栏：物料面板、大纲树等 */}
            <Sidebar />
            
            {/* 中间画布区域 */}
            <div className='flex-1 flex min-w-0 relative'>
              <MainContent materialGroups={materialGroups} />
            </div>
          </div>
        </div>
      </div>

      {/* 拖拽时的跟随元素 */}
      <DragOverlay>
        <div className='w-24 p-1 text-xs flex justify-center items-center rounded-sm border border-slate-600 bg-[#fafafabf] cursor-copy'>
          <span className='text-store-600'>{dragElement?.title}</span>
        </div>
      </DragOverlay>
    </EditorProvider>
  );
};
```

## 画布区域 (MainContent)

画布区域通常包含 `CanvasEditor` 以及周边的配置面板（如属性面板）。

```tsx
import React from 'react';
import { CanvasEditor } from '@tangramino/base-editor';
import { renderCustomElement } from './custom-element';
import { renderDropIndicator } from './drop-indicator';
import { RightPanel } from './right-panel';
import { AttributePanel } from './attribute-panel';

export const MainContent = () => {
  return (
    <>
      {/* 右侧面板：辅助工具 */}
      <RightPanel />
      
      {/* 核心画布 */}
      <div className='flex-1 p-3 overflow-hidden min-w-0'>
        <div className='h-full overflow-auto'>
          <div className='mx-auto border border-gray-200 bg-white shadow-sm min-h-full'>
            <CanvasEditor
              className='size-full'
              renderElement={renderCustomElement}
              renderDropIndicator={renderDropIndicator}
            />
          </div>
        </div>
      </div>
      
      {/* 属性面板 */}
      <AttributePanel />
    </>
  );
};
```

### 自定义元素渲染 (renderElement)

你可以完全控制画布中元素的渲染方式。通常会包裹一个 `ElementWrapper` 来处理选中、拖拽等交互。

```tsx
import { ElementWrapper } from '@tangramino/base-editor';

export const renderCustomElement = (element: Element) => {
  const Component = element.material.Component;
  
  return (
    <ElementWrapper element={element}>
       <Component {...element.props} />
    </ElementWrapper>
  );
};
```

## 侧边栏 (Sidebar)

侧边栏通常用于展示物料列表、大纲树、Schema 源码等。

```tsx
import { useEditorContext } from '@/hooks/use-editor-context';
import { MaterialPanel } from './material-panel';

export const Sidebar = () => {
  const { activeSidebar } = useEditorContext();

  return (
    <div className='w-64 border-r border-gray-200 bg-white flex flex-col'>
       {activeSidebar === 'material' && <MaterialPanel />}
       {/* 其他面板 */}
    </div>
  );
};
```

## 拖拽系统

`@tangramino/base-editor` 提供了 `DragOverlay` 组件，用于在拖拽过程中显示被拖拽元素的预览。你需要将其放在 `EditorProvider` 的子节点中，通常是在最外层。

通过组合这些模块，你可以构建出符合业务需求的自定义编辑器。
