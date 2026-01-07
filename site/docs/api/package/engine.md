# Engine

`@tangramino/engine` 是 Tangramino 的核心引擎包，提供 Schema 解析、状态管理、事件系统等核心能力。

## 安装

```bash
npm install @tangramino/engine
# 或
pnpm add @tangramino/engine
```

## createEngine

创建一个新的引擎实例。

```typescript
import { createEngine } from '@tangramino/engine';

const engine = createEngine(schema);
```

### 参数

| 参数   | 类型     | 必填 | 说明                                   |
| ------ | -------- | ---- | -------------------------------------- |
| schema | `Schema` | 否   | 初始化 Schema，不传则使用默认空 Schema |

### 返回值

返回 `Engine` 实例。

## Engine

引擎实例是 Tangramino 的核心，提供元素管理、状态管理、事件系统等能力。

### 属性

| 属性              | 类型                          | 说明                             |
| ----------------- | ----------------------------- | -------------------------------- |
| elements          | `Elements`                    | 所有元素的映射表，以元素 ID 为键 |
| layouts           | `LayoutTree`                  | 布局树结构，定义元素层级关系     |
| extensions        | `Record<string, unknown>`     | 扩展数据存储                     |
| contextValues     | `ContextValues`               | 共享的上下文值                   |
| injectionCallback | `Record<string, ListenerMap>` | 注入到元素的回调函数             |

### 状态管理方法

#### setState

更新一个或多个元素的状态（props）。

```typescript
engine.setState({
  'element-1': { value: 'new value' },
  'element-2': { checked: true },
});
```

| 参数  | 类型    | 说明                       |
| ----- | ------- | -------------------------- |
| state | `State` | 元素 ID 到新状态的映射对象 |

#### getState

获取元素的状态。

```typescript
// 获取单个元素状态
const state = engine.getState('element-1');

// 获取所有元素状态
const allStates = engine.getState();
```

| 参数 | 类型     | 说明                                  |
| ---- | -------- | ------------------------------------- |
| id   | `string` | 可选，元素 ID。不传则返回所有元素状态 |

**返回值**: 元素的 props 对象，或所有元素状态的映射

### 上下文管理方法

#### setContextValue

设置上下文值。

```typescript
engine.setContextValue('theme', { mode: 'dark' });
```

| 参数  | 类型           | 说明       |
| ----- | -------------- | ---------- |
| field | `string`       | 字段名称   |
| value | `ContextValue` | 要设置的值 |

#### getContextValue

获取上下文值。

```typescript
const theme = engine.getContextValue('theme');
```

| 参数  | 类型     | 说明     |
| ----- | -------- | -------- |
| field | `string` | 字段名称 |

**返回值**: 上下文值或 `undefined`

#### setGlobalVariable

设置全局变量。

```typescript
engine.setGlobalVariable('userName', 'John');
```

| 参数  | 类型      | 说明     |
| ----- | --------- | -------- |
| field | `string`  | 变量名称 |
| value | `unknown` | 变量值   |

#### getGlobalVariable

获取全局变量值。

```typescript
const userName = engine.getGlobalVariable('userName');
```

| 参数  | 类型     | 说明     |
| ----- | -------- | -------- |
| field | `string` | 变量名称 |

**返回值**: 变量值或 `undefined`

### 扩展数据方法

#### setExtensions

设置扩展字段值。

```typescript
engine.setExtensions('customData', { key: 'value' });
```

| 参数  | 类型      | 说明         |
| ----- | --------- | ------------ |
| field | `string`  | 扩展字段名称 |
| value | `unknown` | 扩展值       |

#### getExtensions

获取扩展字段值。

```typescript
const customData = engine.getExtensions('customData');
```

| 参数  | 类型     | 说明         |
| ----- | -------- | ------------ |
| field | `string` | 扩展字段名称 |

**返回值**: 扩展值

### 元素可见性方法

#### showElements

显示（取消隐藏）指定元素。

```typescript
engine.showElements(['element-1', 'element-2']);
```

| 参数 | 类型       | 说明                 |
| ---- | ---------- | -------------------- |
| ids  | `string[]` | 要显示的元素 ID 数组 |

#### hiddenElements

隐藏指定元素。

```typescript
engine.hiddenElements(['element-1', 'element-2']);
```

| 参数 | 类型       | 说明                 |
| ---- | ---------- | -------------------- |
| ids  | `string[]` | 要隐藏的元素 ID 数组 |

### 回调注入方法

#### injectCallback

向元素注入回调函数。

```typescript
engine.injectCallback('button-1', 'onClick', () => {
  console.log('Button clicked');
});
```

| 参数     | 类型       | 说明     |
| -------- | ---------- | -------- |
| id       | `string`   | 元素 ID  |
| name     | `string`   | 回调名称 |
| callback | `Listener` | 回调函数 |

### Schema 操作方法

#### changeSchema

更新整个 Schema。

```typescript
engine.changeSchema(newSchema);
```

| 参数   | 类型     | 说明        |
| ------ | -------- | ----------- |
| schema | `Schema` | 新的 Schema |

#### getSchema

获取当前完整的 Schema。

```typescript
const schema = engine.getSchema();
```

**返回值**: 当前的 `Schema` 对象

#### getElements

获取所有元素的数组形式。

```typescript
const elements = engine.getElements();
// 返回: [{ id: 'el-1', type: 'Button', props: {...} }, ...]
```

**返回值**: 元素对象数组
