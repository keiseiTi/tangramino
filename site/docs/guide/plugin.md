# 插件开发指南

Tangramino 提供了强大的插件系统，允许开发者通过插件机制扩展编辑器的功能。插件可以介入编辑器的生命周期、修改 Schema、注入自定义逻辑等。

## 插件接口定义

插件是一个符合 `Plugin` 接口的对象，主要包含 `id` 和一系列钩子函数。

```typescript
export interface Plugin {
  /** 插件唯一标识 */
  id: string;
  
  /** Schema 转换钩子 */
  transformSchema?: {
    // 插入元素前
    beforeInsertElement?: (schema: Schema, targetId: string, insertElement: InsertElement) => void;
    // 插入元素后
    afterInsertElement?: (nextSchema: Schema) => void;
    // 移动元素前
    beforeMoveElement?: (schema: Schema, sourceId: string, targetId: string) => void;
    // 移动元素后
    afterMoveElement?: (nextSchema: Schema) => void;
    // 删除元素前
    beforeRemoveElement?: (schema: Schema, targetId: string) => void;
    // 删除元素后
    afterRemoveElement?: (nextSchema: Schema) => void;
    // 设置属性前
    beforeSetElementProps?: (schema: Schema, targetId: string, props: Record<string, unknown>) => void;
    // 设置属性后
    afterSetElementProps?: (nextSchema: Schema) => void;
  };

  /** 编辑器上下文钩子 */
  editorContext?: {
    // 物料初始化前
    beforeInitMaterials?: (materials: Material[]) => void;
    // 物料插入后
    afterInsertMaterial?: (sourceElement: Element & { material: Material }, targetElement: Element) => void;
    // 激活元素时
    activateElement?: (element: Element, parentElements: Element[]) => void;
  };
}
```

## 开发一个简单的插件

### 示例 1：表单插件

假设我们需要为特定的组件（如输入框）自动包裹 `Form.Item`，并根据上下文动态添加配置面板。

```typescript
import { Plugin } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Form } from 'antd';

const FormItem = Form.Item;

// 高阶组件：自动包裹 Form.Item
const withForm = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { label, name, required, tooltip } = props;
    const elementId = props['data-element-id'];
    const { schema } = useEditorCore();

    // 判断父级是否为 form
    const isForm = useMemo(() => {
      const parents = SchemaUtils.getParents(schema, elementId);
      const preParent = parents[0];
      return schema.elements[preParent]?.type === 'form';
    }, [schema]);

    if (isForm) {
      return (
        <FormItem label={label} name={name} required={required} tooltip={tooltip}>
          <Component {...props} />
        </FormItem>
      );
    }
    return <Component {...props} />;
  };
};

export const formPlugin = (): Plugin => ({
  id: 'form',
  editorContext: {
    // 在物料初始化前，对组件进行包装
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        const Component = material.Component;
        material.Component = withForm(Component);
      });
    },
    // 激活元素时，动态添加配置面板
    activateElement: (element, parentElements) => {
      if (parentElements.length) {
        const parentElement = parentElements[parentElements.length - 1];
        if (parentElement.type === 'form') {
          const panels = element.material.editorConfig?.panels || [];
          const hasPanel = panels.some((panel) => panel.title === '表单项');
          if (!hasPanel) {
            // 动态插入配置面板
            panels.splice(1, 0, formConfigPanel);
          }
        }
      }
    },
  },
});
```

### 示例 2：物料增强插件

该插件为所有物料自动添加初始化方法和通用属性。

```typescript
import { Plugin } from '@tangramino/base-editor';

export const materialPlugin = (): Plugin => ({
  id: 'material',
  editorContext: {
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        // 注入默认方法
        const methods = material.contextConfig?.methods || [];
        methods.unshift({
          name: 'init',
          description: '初始化',
        });
        material.contextConfig = {
          ...material.contextConfig,
          methods,
        };

        // 注入通用属性配置
        const attrPanel = material?.editorConfig?.panels?.find((panel) => panel.title === '属性');
        if (attrPanel) {
          attrPanel.configs?.unshift({
            label: '别名',
            field: 'alias',
            required: true,
            uiType: 'input',
          });
        }
      });
    },
  },
});
```

## 使用插件

在 `EditorProvider` 中注册插件：

```tsx
import { EditorProvider } from '@tangramino/base-editor';
import { formPlugin } from './plugins/form';
import { materialPlugin } from './plugins/material';

const EditorPage = () => {
  return (
    <EditorProvider
      materials={materials}
      schema={schema}
      plugins={[formPlugin(), materialPlugin()]}
    >
      {/* 编辑器内容 */}
    </EditorProvider>
  );
};
```
