# Schema Engine

## 总览

`@cffe/engine` 提供数据管理、事件管理、解析 `JSONSchema` 等能力。

`@cffe/react-view` 是基于 `react` 的视图框架，作为 `@cffe/engine` 的视图层。

目前我们仅支持 `@cffe/react-view` ，未来我们还会提供 `vue-view` ，`html-view` ，包括支持小程序的视图框架。

**注：拉倒最下有迁移指南**

### 为什么又有新版本？

- 之前的数据是可变的，使用者可随意修改源数据
  - 现在数据是不可变的
- 用类去实例，渲染视图是 `render`
  - 目前的做法更组件化，函数化
- Logic 的理解成本与易用性
  - 用插件的概念表示 Logic

以及支持了 `components`，`plugin` 和自定义元素属性的动态加载

## 安装

```javascript
// 安装engine
fnpm install @cffe/engine --save
// 安装react视图框架
fnpm install @cffe/react-view --save
```

**最新版本 `@cffe/engine@1.0.0`，`@cffe/react-view@1.0.0`**

**注：1.x.x版本不向下兼容**

## 如何使用

```typescript
import React from 'react';
import { createEngine } from '@cffe/engine';
import { ReactView } from '@cffe/react-view';
import components from './components';
import jsonSchema from './json-schema';

const App = () => {
  const engine = useMemo(() => createEngine(jsonSchema), []);
  
  return <ReactView engine={engine} components={components} />;
};
```

通过 `createEngine` 传入 `schema`，即可完成 `engine` 的创建；

和 `components` 一起传入到 `ReactView` 即可渲染视图。

## 概念

### JSONSchema

**如何写一个标准的 `JSONSchema` ?**

```typescript
interface JSONSChame {
  elements: { // 元素集
    [id: string]: {
      type: string;  // 对应注册的组件
      props: { // 通过设置 props 的属性值改变组件
        [attribute: string]: any;
      }
    },
  },
  layout: { // 组件在页面上的布局
    root: string; // 根节点
    structure: {
      [id: string]: string[];
    }
  },
  extensions: { // 扩展数据
    [attribute: string]: any;
  }
}
```

### 插件

插件是什么呢？插件是包含特定逻辑的可插拔式的代码。那在 `schema engine` 中如何开发一个插件呢？

```typescript
const customPlugin = (
  params // 定制点
) => (engine) => {
  // 特定逻辑
}
```

搭配 `Engine` 使用如下

```typescript
<ReactView engine={engine} components={components} plugins={[customPlugin()]} />
```

### ReactView

|属性|说明|必填|
|----|----|----|
|engine|通过 `createEngine` 创建|是|
|components|注册的组件|否|
|plugins|包含特定逻辑的插件|否|

### 钩子

目前提供三个钩子，`useReaction`，`watchReaction`，`watchElement`

#### useReaction

声明一个响应式的变量

```javascript
import { useReaction } from '@cffe/engine';

const [count,setConunt] = useReaction(1);
```

#### watchReaction

观察以 `useReaction` 声明变量的变化，变化后执行相应回调

```javascript
import { useReaction, watchReaction } from '@cffe/engine';

import { useReaction } from '@cffe/engine';

const [count,setConunt] = useReaction(1);

watchReaction(() => {
  // 当 count 变化时，执行此回调
}, [count])
```

#### watchElement

观察元素变化后执行的回调，支持观察多个元素的变化

```javascript
import { watchElement } from "@cffe/engine";

// A，B表示元素a，b的数据
watchElement((A, B) => {
  // 逻辑  
}, ["a", "b"]);
```

## API

### engine

通过函数 `createEngine` 返回的引擎实例

#### getState(id?: string)

设置了 id，则获取单个 elmement 的 data，否则获取所有 element 的 data

#### setState(state: Object)

批量设置 element 的 data

#### getPageState(name?: string)

如果设置了 id，则获取页面中某个 name 的公用的数据，否则获取整份 pageState

#### setPageState(name: string, value: Object)

设置页面某个 name 的公用的数据

#### getExtensions(name?: string)

如果设置了 id，获取 schema 的某个 name 的扩展数据，否则获取整份扩展数据

#### setExtensions(name: string, value: Object)

设置 schema 的某个 name 的扩展数据

#### injectProps(id: string, name: string | Object, value: Object)

可以向某个元素注入自定义属性。与setState的区别在于，
使用 getSchema 时无法获取 injectProps 注入的数据

#### changeSchema(jsonSchema: JSONSchema)

传入新的 shcema，重新渲染组件

#### getSchema()

可以获取到最新的 jsonschema

#### on(namespace: string, eventname: string, listener: Function)

将侦听器函数添加到名为 eventName 的事件的侦听器数组的末尾。不会检查侦听器是否已经添加。

#### emit(namespace: string, eventName: string, [...args])

同步调用为名为 eventName 的事件注册的每个侦听器(按它们注册的顺序)，将提供的参数传递给每个侦听器。

#### once(namespace: string, eventName: string, listener: Function)

为名为 eventName 的事件添加一次性侦听器函数。下一次触发 eventName 时，将删除并调用此侦听器。

#### off(namespace: string, eventName: string, listener: Function)

销毁某个 namespace 中的 某个 eventName 某个事件

#### offAll(namespace: string, eventName: string)

销毁某个 namespace 中的某个 evevtName 的所有事件

## 如何迁移

1. 首先想 `@cffe/engien` 和 `@cffe/react-view` 升级到最新版本。

2. 用 `createEngine` 替换 `new Engine`，并且只要传入 `jsonschema` 即可。

3. 用 `<ReactView />` 替换 `engine.render()` 。

4. `ReactView` 传入 `enigne` 和 `components` 。

5. 将 `engine.registerEvent` 替换成 `engine.injectProps`。

6. 原 `Logic` 的代码平迁至 `Plugin` 即可。


