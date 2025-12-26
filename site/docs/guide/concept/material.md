# 物料体系

物料（Material）是构成页面的基本单元。在 Tangramino 中，物料不仅包含 React 组件，还包含元数据、属性配置面板定义以及逻辑上下文配置。

## Material 接口

```typescript
interface Material {
  /** 唯一标识符 */
  type: string;

  /** 显示名称 */
  title: string;

  /** React 组件 */
  Component: React.ComponentType<any>;

  /** 图标（可选） */
  icon?: React.ReactNode;

  /** 默认属性 */
  defaultProps?: Record<string, unknown>;

  /** 是否为容器（可包含子元素） */
  isContainer?: boolean;

  /** 
   * 是否为块级元素
   * - true: 只能在上下方插入
   * - false: 可在左右插入
   */
  isBlock?: boolean;

  /** 允许拖入的容器类型 */
  dropTypes?: string[];

  /** 属性面板配置 */
  editorConfig?: EditorConfig;

  /** 逻辑上下文配置 */
  contextConfig?: ContextConfig;
}
```

## 属性面板配置

通过 `editorConfig` 自动生成属性配置面板：

```typescript
interface EditorConfig {
  panels?: PanelConfig[];
}

interface PanelConfig {
  title?: React.ReactNode;
  configs?: AttributeConfig[];
}

interface AttributeConfig {
  label?: React.ReactNode;     // 标签文本
  field: string;               // 对应 props 字段名
  uiType?: string;             // 控件类型
  defaultValue?: any;
  required?: boolean;
  props?: Record<string, unknown>;  // 传递给控件的 props
  
  // 联动显示规则
  linkageShow?: {
    field: string;
    value?: any;
    isNotEmpty?: boolean;
  }[];
  
  // 自定义渲染（uiType='custom' 时）
  render?: (props: AttributeConfig) => React.ReactNode;
}
```

### 常用 uiType

| uiType | 描述 | 示例 |
|--------|------|------|
| `input` | 文本输入 | 标题、占位符 |
| `textarea` | 多行文本 | 描述、内容 |
| `number` | 数字输入 | 宽度、数量 |
| `select` | 下拉选择 | 类型、状态 |
| `checkbox` | 复选框 | 禁用、隐藏 |
| `switch` | 开关 | 启用/禁用 |
| `color` | 颜色选择 | 背景色、文字色 |
| `custom` | 自定义渲染 | 复杂配置 |

## 上下文配置

`contextConfig` 定义组件对外暴露的状态和事件，用于流程编排：

```typescript
interface ContextConfig {
  /** 暴露的变量（如 value、disabled） */
  variables?: {
    name: string;
    description?: string;
  }[];

  /** 暴露的方法/事件（如 onClick、onChange） */
  methods?: {
    name: string;
    description?: string;
    params?: { description: string }[];
  }[];
}
```

## 完整示例：输入框物料

```tsx
import { Input } from 'antd';
import type { Material } from '@tangramino/base-editor';

export const InputMaterial: Material = {
  type: 'input',
  title: '输入框',
  Component: Input,
  
  defaultProps: {
    placeholder: '请输入'
  },
  
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          { 
            label: '占位符', 
            field: 'placeholder', 
            uiType: 'input' 
          },
          { 
            label: '最大长度', 
            field: 'maxLength', 
            uiType: 'number',
            props: { min: 0 }
          },
          { 
            label: '禁用', 
            field: 'disabled', 
            uiType: 'switch' 
          }
        ]
      },
      {
        title: '样式',
        configs: [
          {
            label: '尺寸',
            field: 'size',
            uiType: 'select',
            props: {
              options: [
                { label: '大', value: 'large' },
                { label: '中', value: 'middle' },
                { label: '小', value: 'small' }
              ]
            }
          }
        ]
      }
    ]
  },
  
  contextConfig: {
    variables: [
      { name: 'value', description: '输入值' },
      { name: 'disabled', description: '禁用状态' }
    ],
    methods: [
      { name: 'onChange', description: '值变更时触发' },
      { name: 'onFocus', description: '获得焦点时触发' },
      { name: 'onBlur', description: '失去焦点时触发' }
    ]
  }
};
```

## 容器物料示例

```tsx
export const ContainerMaterial: Material = {
  type: 'container',
  title: '容器',
  isContainer: true,  // 标记为容器
  isBlock: true,
  
  Component: ({ children, style, ...props }) => (
    <div style={{ minHeight: 50, ...style }} {...props}>
      {children}
    </div>
  ),
  
  defaultProps: {
    style: { padding: 16 }
  },
  
  editorConfig: {
    panels: [{
      title: '布局',
      configs: [
        {
          label: '内边距',
          field: 'style.padding',
          uiType: 'number',
          props: { min: 0 }
        },
        {
          label: '背景色',
          field: 'style.backgroundColor',
          uiType: 'color'
        }
      ]
    }]
  }
};
```

## 联动显示

根据条件显示/隐藏配置项：

```tsx
{
  configs: [
    {
      label: '显示标题',
      field: 'showTitle',
      uiType: 'switch'
    },
    {
      label: '标题文本',
      field: 'title',
      uiType: 'input',
      // 仅当 showTitle 为 true 时显示
      linkageShow: [{ field: 'showTitle', value: true }]
    }
  ]
}
```

## 最佳实践

1. **type 命名**：使用小写连字符，如 `date-picker`
2. **分组配置**：将相关属性放在同一 panel 中
3. **默认值**：为常用属性提供合理的默认值
4. **描述完整**：为 contextConfig 中的变量和方法添加描述
