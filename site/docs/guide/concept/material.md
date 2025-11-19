# 物料 (Material)

物料是低代码平台的核心概念之一，它代表了可以在画布上拖拽、配置和渲染的组件单元。

## 接口定义

在 `packages/base-editor/src/interface/material.ts` 中定义了物料的核心接口 `Material` 和组件属性接口 `MaterialComponentProps`。

### Material 接口

```typescript
import React from 'react';
import type { EditorConfig } from './editor-config';
import type { ContextConfig } from './context-config';

export interface Material {
  /**
   * 物料对应的组件
   */
  Component: React.ComponentType;
  /**
   * 物料名称
   */
  title: string;
  /**
   * 物料类型，唯一标识
   */
  type: string;
  /**
   * 物料图标
   */
  icon?: React.ReactNode;
  /**
   * 拖拽到的物料类型
   * 如果是容器，可以限制哪些类型的物料可以放入
   */
  dropType?: string | string[];
  /**
   * 物料默认属性
   */
  defaultProps?: Record<string, unknown>;
  /**
   * 是否为容器
   */
  isContainer?: boolean;
  /**
   * 编辑器配置
   * 用于生成属性配置面板
   */
  editorConfig?: EditorConfig;
  /**
   * 流程上下文配置
   * 用于对外暴露变量和方法
   */
  contextConfig?: ContextConfig;
}
```

### MaterialComponentProps 接口

物料组件会接收到一些通用的属性：

```typescript
export interface MaterialComponentProps {
  /**
   * 是否只读
   */
  tg_readonly?: boolean;
  /**
   * 状态
   * edit: 编辑态
   * render: 渲染态
   */
  tg_mode?: 'edit' | 'render';
}
```

## 与 Schema 的关系

物料是 Schema 中 `elements` 的具体实现。

- **类型映射**：Schema 中元素的 `type` 字段对应物料定义的 `type`。引擎根据这个字段找到对应的物料组件进行渲染。
- **属性映射**：Schema 中元素的 `props` 字段会作为 props 传递给物料组件。

例如，Schema 中的一个元素定义：

```json
{
  "elements": {
    "btn_1": {
      "type": "button", // 对应 ButtonMaterial.type
      "props": {
        "text": "提交", // 传递给 Button 组件的 props
        "type": "primary"
      }
    }
  }
}
```

对应渲染时，相当于：

```jsx
<Button text="提交" type="primary" />
```

## 示例：按钮物料

下面以 `playground/antd-demo/src/materials/button` 为例，展示如何实现一个按钮物料。

### 1. 实现组件

首先实现 React 组件，它接受 `MaterialComponentProps` 和自定义属性。

```tsx
// src/materials/button/index.tsx
import React from 'react';
import { Button as AntdButton, type ButtonProps } from 'antd';
import type { MaterialComponentProps } from '@tangramino/base-editor';

interface IProps extends ButtonProps, MaterialComponentProps {
  text?: string;
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
}

export const Button = (props: IProps) => {
  const { text, margin, padding, width, height, style, onClick, ...restProps } =
    props;

  // 处理样式
  const customStyle = {
    margin,
    padding,
    width,
    height,
    ...style,
  };

  // 处理点击事件，编辑态下阻止默认行为
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.tg_mode !== 'render') {
      e.preventDefault();
    }
    onClick?.(e);
  };

  return (
    <AntdButton style={customStyle} {...restProps} onClick={handleClick}>
      {text}
    </AntdButton>
  );
};
```

### 2. 配置物料

定义物料的元数据、属性编辑器配置和上下文配置。

```typescript
// src/materials/button/material-config.ts
import { Button } from './index';
import type { Material } from '@/interfaces/material';

const ButtonMaterial: Material = {
  Component: Button,
  title: '按钮',
  type: 'button',
  defaultProps: {
    text: '按钮',
    type: 'default',
    size: 'middle',
  },
  // 上下文配置：暴露变量和方法给流程编排使用
  contextConfig: {
    variables: [
      { name: 'text', description: '按钮文本' },
      { name: 'disabled', description: '禁用按钮' },
      { name: 'loading', description: '按钮载入状态' },
    ],
    methods: [
      {
        name: 'onClick',
        description: '点击事件',
        params: [{ description: '点击事件参数' }],
      },
    ],
  },
  // 编辑器配置：定义属性面板
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '按钮文本',
            field: 'text',
            uiType: 'input',
            props: { placeholder: '请输入按钮文本' },
          },
          {
            label: '按钮类型',
            field: 'type',
            uiType: 'select',
            props: {
              options: [
                { label: '默认', value: 'default' },
                { label: '主要', value: 'primary' },
                // ... 其他选项
              ],
            },
          },
          // ... 其他属性配置
        ],
      },
      {
        title: '样式',
        configs: [
          {
            label: '宽度',
            field: 'width',
            uiType: 'number',
            props: { suffix: 'px' },
          },
          // ... 其他样式配置
        ],
      },
    ],
  },
};

export default ButtonMaterial;
```
