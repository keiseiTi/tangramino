# Schema Engine 使用指南

## Installation

To install the stable version:

```javascript
fnpm install @tangramino/engine --save
```

To install react viewFrame:

```javascript
fnpm install @tangramino/react --save
```

## Explain

`@tangramino/engine` 提供数据管理、事件管理、解析 `JSONSchema` 等能力。

`@tangramino/react` 是基于 `react` 的视图框架，作为 `@tangramino/engine` 的视图层。

目前我们仅支持 `@tangramino/react` ，未来我们还会提供 `vue-view` ，`html-view` ，包括支持小程序的视图框架。

## How to use

首先我们要实例化 `Engine` ，`Engine` 需要五个参数，分别是 `container` ， `components` ， `JSONSchema` ，`main` 以及 `viewFrame`，具体含义见下文。

以下就是具体写法

```javascript
import Engine, { connect } from '@tangramino/engine';
import ReactView from '@tangramino/react';
import Components from './component';
import JSONSchema from './json-schema';
import Logic from './logic';

const engine = new Engine({
  container: document.querySelector('root'),
  components: Components,
  JSONSchema: JSONSchema,
  viewFrame: ReactView,
  main: connect()(Logic)
});

engine.render(); // 即可渲染视图
```

### connect

`connect` 是什么？是用来向 `Logic` 注入参数以及引擎的 `store` 和 `event`。

通过 `connect` ，就可以在 `Logic` 中使用 `store` 和 `event` 的相关方法。

### logic

`logic` 代表业务逻辑块，拥有三个生命周期，分别是 `didMount` ，`willReceiveState` 和 `willMount` 。

那 `main` 是什么呢？是作为业务逻辑的主入口。

**未来我们提供方式去复用 `logic` 。**

#### 如何去写一份 logic

```javascript
import Engine from '@cffe/engine';

export default class Login extends Engine.Logic {
  constructor(props) {
    super(props);
    // 可以使用 logic 的 API
  }
  didMount() {}
  static willReceiveState(state) {
    // 修改 state
    return state;
  }
  willMount() {}
}
```

## Engine 属性

| 属名       | 说明                   | 类型        | 必填 |
| ---------- | ---------------------- | ----------- | ---- |
| container  | 指定 schema 渲染的 DOM | HTMLElement | 是   |
| JSONSchema | 描述页面的 json 数据   | Object      | -    |
| components | 注册的组件             | -           | -    |
| main       | 逻辑的入口             | -           | 是   |
| viewFrame  | 视图框架               | -           | 是   |

## JSONSchema

**如何写一个标准的 `JSONSchema` ?**

```typescript
interface JSONSChame {
  elements: {
    // 元素集
    [id: string]: {
      type: string; // 对应注册的组件
      props: {
        // 通过设置 props 的属性值改变组件
        [attribute: string]: string;
      };
      [attribute: string]: string; // 此元素的静态属性
    };
  };
  layout: {
    // 组件在页面上的布局
    root: string; // 根节点
    structure: {
      [id: string]: string[];
    };
  };
  extensions: {
    // 扩展数据
    [attribute: string]: string;
  };
}
```

## Logic 生命周期

### didMount()

视图渲染后执行的方法。

### static willReceiveState(state)

`willReceiveState` 会在方法 `setData` 、`setState` 执行后调用。传入的参数就是改变后的 `state`，它应返回一个对象来更新 `state`。

### willUnmount()

视图挂载后执行的方法。

![IMAGE](quiver-image-url/70B2B6EA8B7791D8F0CF8213223C487A.jpg =591x330)

## API

### Engine 实例

#### on(namespace: string, eventname: string, listener: Function)

将侦听器函数添加到名为 eventName 的事件的侦听器数组的末尾。不会检查侦听器是否已经添加。

#### emit(namespace: string, eventName: string, [...args])

同步调用为名为 eventName 的事件注册的每个侦听器(按它们注册的顺序)，将提供的参数传递给每个侦听器。

#### once(namespace: string, eventName: string, listener: Function)

为名为 eventName 的事件添加一次性侦听器函数。下一次触发 eventName 时，将删除并调用此侦听器。

#### off(namespace: string, eventName: string, listener: Function)

销毁某个 namespace 中的 某个 eventName 某个事件

#### registerEvent(namespace: string, eventName: string, listener: Function)

为某个 namespace 的组件注册某个 eventName 的事件

#### getState()

获取所有 element 的 data

#### setState(state: Object)

批量设置 element 的 data

#### getData()

获取单个 element 的 data

#### setData(id: string , state: Object)

设置单个 element 的 data

#### render()

根据解析后 schema 通过视图框架渲染视图

### Logic

提供但不限于 `Engine` 实例

#### offAll(namespace: string, eventName: string)

销毁某个 namespace 中的某个 evevtName 的所有事件

#### getStaticData(id: string)

获取某个元素的静态属性

#### setStaticData(id: string, value: DataType, options?: RenderOptions)

设置某个元素的静态属性，通过传入 `options: {render: true}`，以来更新视图

#### getStaticData(id: string)

获取某个元素的静态属性

#### getPageState(name: string)

获取页面中某个 name 的公用的数据

#### setPageState(name: string, value: Object)

设置页面某个 name 的公用的数据

#### getExtensions(name: string)

获取 schema 的某个 name 的扩展数据

#### setExtensions(name: string, value: Object)

设置 schema 的某个 name 的扩展数据
