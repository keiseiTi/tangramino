# React 渲染器

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
        Container: MyContainer
      }}
      plugins={[myPlugin]}
    />
  );
}
```

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| engine | `Engine` | 是 | 引擎实例 |
| components | `Record<string, React.ComponentType>` | 否 | 组件类型到 React 组件的映射 |
| plugins | `Plugin[]` | 否 | 渲染时插件数组 |

### 组件 Props 注入

通过 `components` 映射的组件会自动接收以下 props：

| 属性 | 类型 | 说明 |
|------|------|------|
| data | `Record<string, unknown>` | 元素的 props 数据 |
| hidden | `boolean \| undefined` | 元素是否隐藏 |
| children | `React.ReactNode` | 子元素（如果有） |

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
    btn1: { type: 'Button', props: { text: 'Click me' } }
  },
  layout: {
    root: 'root',
    structure: { root: ['btn1'] }
  },
  extensions: {}
});

// 渲染
function App() {
  return (
    <ReactView
      engine={engine}
      components={{ Button, Container }}
    />
  );
}
```

#### 响应状态更新

ReactView 会自动监听引擎的 `VIEW_UPDATE` 和 `ELEMENT_UPDATE` 事件，当 Schema 或元素状态变化时自动重新渲染。

```tsx
function App() {
  const handleUpdate = () => {
    // 更新元素状态，视图会自动刷新
    engine.setState({
      btn1: { text: 'Updated!' }
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

### 插件示例

```typescript
// 日志插件
const logPlugin: Plugin = (engine) => {
  engine.subscribe('ELEMENT_UPDATE', () => {
    console.log('Elements updated:', engine.elements);
  });
};

// 初始化插件
const initPlugin: Plugin = (engine) => {
  // 设置初始全局变量
  engine.setGlobalVariable('appVersion', '1.0.0');
};
```

### 使用插件

```tsx
<ReactView
  engine={engine}
  components={components}
  plugins={[logPlugin, initPlugin]}
/>
```

## HocComponent（内部组件）

`HocComponent` 是一个高阶组件工厂，用于增强用户提供的组件。它由 ReactView 内部使用，通常不需要直接调用。

### 功能

- 自动注入 `data` 和 `hidden` props
- 处理组件的子元素渲染
- 管理组件的生命周期

## 最佳实践

### 组件设计

```tsx
// 推荐：解构 data 中需要的属性
const Input = ({ data }) => {
  const { value, placeholder, onChange } = data;
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};

// 支持子组件
const Card = ({ data, children }) => (
  <div className="card" style={data.style}>
    {data.title && <h3>{data.title}</h3>}
    <div className="card-content">{children}</div>
  </div>
);
```

### 处理隐藏状态

```tsx
const ConditionalComponent = ({ data, hidden, children }) => {
  // ReactView 会自动传入 hidden 属性
  // 你可以选择如何处理它
  if (hidden) {
    return null; // 完全不渲染
    // 或者
    // return <div style={{ display: 'none' }}>{children}</div>;
  }
  return <div>{children}</div>;
};
```

### 与 Engine 事件集成

```tsx
const InteractiveButton = ({ data }) => {
  // 组件可以触发 Engine 事件
  const handleClick = () => {
    // data 中可以包含 engine 实例的引用或事件触发函数
    data.onTrigger?.('click', { timestamp: Date.now() });
  };

  return <button onClick={handleClick}>{data.text}</button>;
};
```

## 类型定义

### ReactViewProps

```typescript
interface ReactViewProps {
  engine: Engine;
  components?: {
    [name: string]: React.ComponentType;
  };
  plugins?: Plugin[];
}
```

### MaterialComponentProps（组件接收的 props）

```typescript
interface MaterialComponentProps {
  data: Record<string, unknown>;
  hidden?: boolean;
  children?: React.ReactNode;
}
```
