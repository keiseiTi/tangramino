# 插件

插件机制允许开发者介入编辑器的各个生命周期，修改 Schema 或扩展编辑器功能。

## 接口定义

在 `packages/base-editor/src/interface/plugin.ts` 中定义了插件接口 `Plugin`。

```typescript
import type { Schema, InsertElement } from '@tangramino/engine';
import type { Material } from './material';

export interface Plugin {
  /**
   * 插件唯一标识
   */
  id: string;
  /**
   * Schema 转换钩子
   * 用于在 Schema 变更前后进行拦截和修改
   */
  transformSchema?: {
    beforeInsertElement?: (
      schema: Schema,
      targetId: string,
      insertElement: InsertElement,
    ) => void;
    afterInsertElement?: (nextSchema: Schema) => void;
    beforeMoveElement?: (
      schema: Schema,
      sourceId: string,
      targetId: string,
    ) => void;
    afterMoveElement?: (nextSchema: Schema) => void;
    beforeRemoveElement?: (schema: Schema, targetId: string) => void;
    afterRemoveElement?: (nextSchema: Schema) => void;
    beforeSetElementProps?: (
      schema: Schema,
      targetId: string,
      props: Record<string, unknown>,
    ) => void;
    afterSetElementProps?: (nextSchema: Schema) => void;
  };
  /**
   * 编辑器上下文钩子
   */
  editorContext?: {
    /**
     * 物料初始化前钩子
     * 可用于动态修改或过滤物料列表
     */
    beforeInitMaterials?: (materials: Material[]) => void;
    /**
     * 物料插入后钩子
     * 可用于后续初始化、事件绑定或联动逻辑
     */
    afterInsertMaterial?: (
      sourceElement: Element & {
        material: Material;
      },
      targetElement: Element,
    ) => void;
    /**
     * 元素激活钩子
     * 当元素被点击或聚焦时触发
     */
    activateElement?: (
      element: Element & {
        material: Material;
      },
      parentElements: (Element & {
        material: Material;
      })[],
    ) => void;
  };
}
```

## 钩子详解

### transformSchema

这一组钩子允许你在 Schema 发生变更（增删改查）的前后时机介入。

- **before...**: 在操作执行前触发。你可以在这里修改传入的参数，或者抛出错误阻止操作。
- **after...**: 在操作执行后触发。你可以获取到更新后的 Schema。

### editorContext

- **beforeInitMaterials**: 在编辑器加载物料列表之前触发。你可以利用这个钩子来动态添加、删除或修改物料配置。
- **afterInsertMaterial**: 物料成功插入编辑器后触发。可用于后续初始化、事件绑定或联动逻辑。
- **activateElement**: 当元素被激活（如点击或聚焦）时触发。提供当前激活元素及其父级链，用于上下文操作。

## 示例：日志插件

下面是一个简单的插件示例，它会在每次插入元素后打印日志。

```typescript
import type { Plugin } from '@tangramino/base-editor';

const LoggerPlugin: Plugin = {
  id: 'logger-plugin',
  transformSchema: {
    beforeInsertElement: (schema, targetId, insertElement) => {
      console.log('准备插入元素:', insertElement);
    },
    afterInsertElement: (nextSchema) => {
      console.log('元素插入完成，当前 Schema:', nextSchema);
    },
  },
};

export default LoggerPlugin;
```

## 示例：修改物料默认属性

这个插件会在物料加载时，修改按钮物料的默认文本。

```typescript
import type { Plugin } from '@tangramino/base-editor';

const CustomMaterialPlugin: Plugin = {
  id: 'custom-material-plugin',
  editorContext: {
    beforeInitMaterials: (materials) => {
      const buttonMaterial = materials.find((m) => m.type === 'button');
      if (buttonMaterial && buttonMaterial.defaultProps) {
        buttonMaterial.defaultProps.text = '自定义按钮';
      }
    },
  },
};

export default CustomMaterialPlugin;
```
