# 物料体系

物料（Material）是构成页面的基本单元。在 Tangramino 中，物料不仅包含 React 组件本身，还包含该组件在编辑器中的元数据、属性配置面板定义以及逻辑上下文配置。

## Material 接口

```typescript
export interface Material {
  /** 唯一标识符 */
  type: string;

  /** 物料展示名称 */
  title: string;

  /** 运行时渲染的 React 组件 */
  Component: React.ComponentType<any>;

  /** 物料图标 (可选) */
  icon?: React.ReactNode;

  /** 
   * 允许拖入的容器类型列表
   * 若未定义，则允许拖入任何容器
   */
  dropTypes?: string[];

  /** 默认属性值 */
  defaultProps?: Record<string, unknown>;

  /** 是否为容器组件 (可包含子元素) */
  isContainer?: boolean;

  /** 
   * 是否为块级元素 
   * 影响拖拽时的占位表现：
   * - true: 只能在上下方插入
   * - false: 可在左右插入
   */
  isBlock?: boolean;

  /** 编辑器属性面板配置 */
  editorConfig?: EditorConfig;

  /** 逻辑上下文配置 (用于流程编排) */
  contextConfig?: ContextConfig;
}
```

## 属性面板配置 (EditorConfig)

通过 `editorConfig` 可以自动生成编辑器右侧的属性配置面板。

```typescript
interface EditorConfig {
  panels?: PanelConfig[];
}

interface PanelConfig {
  title?: React.ReactNode;
  configs?: AttributeConfig[];
}

// 属性配置项
type AttributeConfig = {
  label?: React.ReactNode; // 标签文本
  field: string;           // 对应 props 中的字段名
  uiType?: string;         // 控件类型: 'input' | 'select' | 'color' | ...
  defaultValue?: any;
  required?: boolean;
  props?: Record<string, unknown>; // 传递给配置控件的 props
  // 联动显示规则
  linkageShow?: {
    field: string;
    value?: any;
    isNotEmpty?: boolean;
  }[];
  // 自定义渲染函数 (uiType='custom' 时使用)
  render?: (props: AttributeConfig) => React.ReactNode;
};
```

## 上下文配置 (ContextConfig)

`contextConfig` 定义了组件对外暴露的状态和事件，用于在逻辑编排中被引用。

```typescript
interface ContextConfig {
  /** 
   * 暴露的变量 
   * 例如: 输入框的 value,禁用状态 disabled
   */
  variables?: {
    name: string;
    description?: string;
  }[];

  /** 
   * 暴露的方法/事件
   * 例如: onClick, setValue, validate
   */
  methods?: {
    name: string;
    description?: string;
    params?: { description: string }[];
  }[];
  
  /**
   * 上下文值定义
   * 通常用于同时包含属性和方法的混合定义
   */
  contextValues?: {
    name: string;
    description?: string;
    isMethod?: boolean;
  }[];
}
```

## 示例：输入框物料

```tsx
import { Input } from 'antd';

const InputMaterial: Material = {
  type: 'input',
  title: '输入框',
  Component: Input,
  defaultProps: { placeholder: '请输入' },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          { label: '占位符', field: 'placeholder', uiType: 'input' },
          { label: '禁用', field: 'disabled', uiType: 'checkbox' }
        ]
      }
    ]
  },
  contextConfig: {
    variables: [
      { name: 'value', description: '输入值' }
    ],
    methods: [
      { name: 'onChange', description: '值变更' },
      { name: 'focus', description: '聚焦' }
    ]
  }
};
```