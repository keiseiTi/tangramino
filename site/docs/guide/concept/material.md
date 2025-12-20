# 物料体系

物料（Material）是构建页面的积木。在 Tangramino 中，物料不仅仅是一个 React 组件，它还包含了该组件在编辑器中表现的所有元信息。

## 物料定义

一个标准的物料定义如下：

```typescript
export interface Material<P = any> {
  /** 物料类型 (唯一标识) */
  type: string;

  /** 物料标题 */
  title: string;

  /** 物料图标 (ReactNode) */
  icon?: React.ReactNode;

  /** 
   * 运行时渲染组件 
   * 这是在最终页面中实际渲染的组件
   */
  Component: React.ComponentType<P>;

  /** 
   * 初始属性 
   * 拖入画布时默认携带的 props
   */
  defaultProps?: Partial<P>;

  /** 
   * 是否为容器
   * 容器可以包含其他元素
   */
  isContainer?: boolean;

  /** 
   * 是否为块级元素
   * Block 元素只能在上下方插入，非 Block 元素可以左右插入
   */
  isBlock?: boolean;

  /** 
   * 允许放入的容器类型
   * 如果设置，只能拖入指定类型的容器中
   */
  dropTypes?: string[];

  /** 
   * 编辑器配置 
   * 定义了该物料在编辑器中的属性面板配置
   */
  editorConfig?: EditorConfig;

  /** 
   * 上下文配置 
   * 定义物料的变量和方法，用于流程编辑
   */
  contextConfig?: ContextConfig;
}
```

## 物料分类

在实际项目中，我们通常会将物料进行分类管理，例如：

- **基础组件**：按钮、文本、图片等原子组件。
- **表单组件**：输入框、选择器、开关等用于数据录入的组件。
- **容器组件**：布局容器、卡片、弹窗等可以嵌套子元素的组件。
- **业务组件**：特定业务场景下的复杂组件。

## 开发物料

开发一个物料通常只需三个步骤：

1.  **编写组件**：开发标准的 React 组件。
2.  **定义配置**：描述组件有哪些属性可以配置（用于生成属性面板）。
3.  **注册物料**：将物料对象传递给 `EditorProvider`。

### 示例：自定义按钮物料

```tsx
import { Button } from 'antd';
import { Material } from '@tangramino/base-editor';

export const ButtonMaterial: Material = {
  type: 'button',
  title: '按钮',
  Component: Button,
  props: {
    type: 'primary',
    children: '按钮文本',
  },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            label: '文本',
            field: 'children', // 对应 props.children
            uiType: 'input',   // 使用输入框编辑
          },
          {
            label: '类型',
            field: 'type',     // 对应 props.type
            uiType: 'select',  // 使用下拉框编辑
            options: [
              { label: '主按钮', value: 'primary' },
              { label: '次按钮', value: 'default' },
            ],
          },
        ],
      },
    ],
  },
};
```
