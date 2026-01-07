# React Renderer

`@tangramino/react` 提供 React 渲染能力，将 Engine 中的 Schema 渲染为 React 组件树。

## 安装

```bash
npm install @tangramino/react
# 或
pnpm add @tangramino/react
```

## ReactView

React 视图组件，负责将引擎的布局树渲染为 React 组件。

```tsx
import { ReactView } from '@tangramino/react';
import { createEngine } from '@tangramino/engine';

const engine = createEngine(schema);

function App() {
  return (
    <ReactView
      engine={engine}
      components={{
        Button: MyButton,
        Input: MyInput,
        Container: MyContainer,
      }}
      plugins={[myPlugin]}
    />
  );
}
```

### Props

| 属性       | 类型                                  | 必填 | 说明                        |
| ---------- | ------------------------------------- | ---- | --------------------------- |
| engine     | `Engine`                              | 是   | 引擎实例                    |
| components | `Record<string, React.ComponentType>` | 否   | 组件类型到 React 组件的映射 |
| plugins    | `Plugin[]`                            | 否   | 渲染时插件数组              |

### 组件 Props 注入

通过 `components` 映射的组件会自动接收以下 props：

| 属性     | 类型                      | 说明              |
| -------- | ------------------------- | ----------------- |
| data     | `Record<string, unknown>` | 元素的 props 数据 |
| hidden   | `boolean \| undefined`    | 元素是否隐藏      |
| children | `React.ReactNode`         | 子元素（如果有）  |

### 使用示例

#### 基础渲染

```tsx
import { ReactView } from '@tangramino/react';
import { createEngine } from '@tangramino/engine';

// 定义组件
const Button = ({ data, children }) => (
  <button onClick={data.onClick} disabled={data.disabled}>
    {data.text || children}
  </button>
);

const Container = ({ data, children }) => (
  <div style={data.style}>{children}</div>
);

// 创建引擎
const engine = createEngine({
  elements: {
    root: { type: 'Container', props: { style: { padding: 20 } } },
    btn1: { type: 'Button', props: { text: 'Click me' } },
  },
  layout: {
    root: 'root',
    structure: { root: ['btn1'] },
  },
  extensions: {},
});

// 渲染
function App() {
  return <ReactView engine={engine} components={{ Button, Container }} />;
}
```

#### 响应状态更新

ReactView 会自动监听引擎的 `VIEW_UPDATE` 和 `ELEMENT_UPDATE` 事件，当 Schema 或元素状态变化时自动重新渲染。

```tsx
function App() {
  const handleUpdate = () => {
    // 更新元素状态，视图会自动刷新
    engine.setState({
      btn1: { text: 'Updated!' },
    });
  };

  return (
    <>
      <button onClick={handleUpdate}>Update</button>
      <ReactView engine={engine} components={components} />
    </>
  );
}
```

## Plugin 类型

渲染时插件是一个接收 Engine 实例的函数。

```typescript
type Plugin = (engine: Engine) => void;
```
