# SchemaUtils

`SchemaUtils` 是一组用于操作 Schema 的工具函数，提供元素的增删改查、移动、属性更新等操作。

## 导入

```typescript
import { SchemaUtils } from '@tangramino/engine';
```

## 元素操作

### insertElement

向 Schema 中插入新元素作为指定元素的子元素。

```typescript
const result = SchemaUtils.insertElement(schema, 'container-1', {
  id: 'button-1',
  type: 'Button',
  props: { text: 'Click me' },
});

// result.schema: 更新后的 Schema
// result.operation: { elementId, parentId, index, element }
```

| 参数            | 类型            | 说明          |
| --------------- | --------------- | ------------- |
| schema          | `Schema`        | 当前 Schema   |
| originElementId | `string`        | 目标父元素 ID |
| insertElement   | `InsertElement` | 要插入的元素  |

**返回值**: `InsertElementResult`
- `schema`: 插入后的新 Schema
- `operation`: 插入操作的详细信息
  - `elementId`: 插入的元素 ID
  - `parentId`: 父元素 ID
  - `index`: 插入的索引位置
  - `element`: 插入的元素数据

### insertAdjacentElement

在指定元素的同级前后插入新元素。

```typescript
// 在 button-1 之后插入
const result = SchemaUtils.insertAdjacentElement(
  schema,
  'button-1',
  {
    id: 'button-2',
    type: 'Button',
    props: { text: 'New Button' },
  },
  'after',
);
```

| 参数            | 类型                                    | 说明         |
| --------------- | --------------------------------------- | ------------ |
| schema          | `Schema`                                | 当前 Schema  |
| targetElementId | `string`                                | 目标元素 ID  |
| insertElement   | `InsertElement`                         | 要插入的元素 |
| position        | `'before' \| 'after' \| 'up' \| 'down'` | 插入位置     |

**返回值**: `InsertElementResult` (同 insertElement)

### removeElement

从 Schema 中删除元素及其所有子元素。

```typescript
const result = SchemaUtils.removeElement(schema, 'button-1');

// result.schema: 更新后的 Schema
// result.operation: { elementId, parentId, index, element }
```

| 参数      | 类型     | 说明            |
| --------- | -------- | --------------- |
| schema    | `Schema` | 当前 Schema     |
| elementId | `string` | 要删除的元素 ID |

**返回值**: `RemoveElementResult`
- `schema`: 删除后的新 Schema
- `operation`: 删除操作的详细信息
  - `elementId`: 删除的元素 ID
  - `parentId`: 父元素 ID
  - `index`: 原索引位置
  - `element`: 删除的元素快照（包含所有子元素）

### moveElement

移动元素到新位置。

```typescript
// 跨级移动：将元素移动到目标元素下
const result = SchemaUtils.moveElement(schema, 'button-1', 'container-2');

// 同级移动：在同级元素之间移动
const result = SchemaUtils.moveElement(schema, 'button-1', 'button-3', {
  mode: 'same-level',
  position: 'before',
});

// result.operation: { elementId, oldParentId, oldIndex, newParentId, newIndex, mode }
```

| 参数             | 类型                                    | 说明                           |
| ---------------- | --------------------------------------- | ------------------------------ |
| schema           | `Schema`                                | 当前 Schema                    |
| elementId        | `string`                                | 要移动的元素 ID                |
| targetElementId  | `string`                                | 目标元素 ID                    |
| options          | `object`                                | 可选配置                       |
| options.mode     | `'same-level' \| 'cross-level'`         | 移动模式，默认 `'cross-level'` |
| options.position | `'before' \| 'after' \| 'up' \| 'down'` | 插入位置                       |

**返回值**: `MoveElementResult`
- `schema`: 移动后的新 Schema
- `operation`: 移动操作的详细信息
  - `elementId`: 移动的元素 ID
  - `oldParentId`: 原父元素 ID
  - `oldIndex`: 原索引位置
  - `newParentId`: 新父元素 ID
  - `newIndex`: 新索引位置
  - `mode`: 移动模式

## 元素查询

### getElementById

根据 ID 获取元素。

```typescript
const element = SchemaUtils.getElementById(schema, 'button-1');
// 返回: { id: 'button-1', type: 'Button', props: {...} }
```

| 参数   | 类型     | 说明        |
| ------ | -------- | ----------- |
| schema | `Schema` | 当前 Schema |
| id     | `string` | 元素 ID     |

**返回值**: 包含 `id` 和元素属性的对象

### getElementsByType

获取所有指定类型的元素。

```typescript
const buttons = SchemaUtils.getElementsByType(schema, 'Button');
// 返回: [{ id: 'button-1', type: 'Button', props: {...} }, ...]
```

| 参数   | 类型     | 说明        |
| ------ | -------- | ----------- |
| schema | `Schema` | 当前 Schema |
| type   | `string` | 元素类型    |

**返回值**: 匹配元素的数组

### getParents

获取元素的所有父元素链，从直接父元素到根节点。

```typescript
const parents = SchemaUtils.getParents(schema, 'button-1');
// 返回: ['container-1', 'root']
```

| 参数      | 类型     | 说明        |
| --------- | -------- | ----------- |
| schema    | `Schema` | 当前 Schema |
| elementId | `string` | 元素 ID     |

**返回值**: 从直接父元素到根节点的元素 ID 数组

## 属性操作

### setElementProps

更新元素的属性。

```typescript
const result = SchemaUtils.setElementProps(schema, 'button-1', {
  text: 'Updated text',
  disabled: true,
});

// result.schema: 更新后的 Schema
// result.operation: { elementId, props, oldProps }
```

| 参数      | 类型                      | 说明         |
| --------- | ------------------------- | ------------ |
| schema    | `Schema`                  | 当前 Schema  |
| elementId | `string`                  | 元素 ID      |
| props     | `Record<string, unknown>` | 要更新的属性 |

**返回值**: `SetElementPropsResult`
- `schema`: 更新后的新 Schema
- `operation`: 更新操作的详细信息
  - `elementId`: 元素 ID
  - `props`: 新属性
  - `oldProps`: 更新前的旧属性

## 流程图操作

### getFlowGraph

获取扩展中的流程图数据。

```typescript
const flowGraph = SchemaUtils.getFlowGraph(schema, 'onButtonClick');
```

| 参数         | 类型     | 说明         |
| ------------ | -------- | ------------ |
| schema       | `Schema` | 当前 Schema  |
| flowGraphKey | `string` | 流程图的键名 |

**返回值**: 流程图数据

### setFlowGraph

设置扩展中的流程图数据。

```typescript
const newSchema = SchemaUtils.setFlowGraph(schema, 'onButtonClick', {
  nodes: [...],
  edges: [...]
});
```

| 参数         | 类型     | 说明         |
| ------------ | -------- | ------------ |
| schema       | `Schema` | 当前 Schema  |
| flowGraphKey | `string` | 流程图的键名 |
| flowGraph    | `T`      | 流程图数据   |

**返回值**: 更新后的新 `Schema`

### setEventFlow

设置元素事件对应的流程。

```typescript
const newSchema = SchemaUtils.setEventFlow(
  schema,
  'button-1',
  'onClick',
  'flow-1',
  { nodes: [...], edges: [...] }
);
```

| 参数      | 类型     | 说明        |
| --------- | -------- | ----------- |
| schema    | `Schema` | 当前 Schema |
| elementId | `string` | 元素 ID     |
| event     | `string` | 事件名称    |
| flowId    | `string` | 流程 ID     |
| flow      | `Flow`   | 流程数据    |

**返回值**: 更新后的新 `Schema`

## 全局变量操作

### getGlobalVariables

获取所有全局变量。

```typescript
const variables = SchemaUtils.getGlobalVariables(schema);
// 返回: [{ name: 'userName', description: '用户名', defaultValue: '' }, ...]
```

| 参数   | 类型     | 说明        |
| ------ | -------- | ----------- |
| schema | `Schema` | 当前 Schema |

**返回值**: 全局变量数组（返回副本，避免修改原数据）

### setGlobalVariables

设置全局变量。

```typescript
const newSchema = SchemaUtils.setGlobalVariables(schema, [
  { name: 'userName', description: '用户名', defaultValue: '' },
  { name: 'userAge', description: '用户年龄', type: 'number', defaultValue: 0 },
]);
```

| 参数      | 类型               | 说明         |
| --------- | ------------------ | ------------ |
| schema    | `Schema`           | 当前 Schema  |
| variables | `GlobalVariable[]` | 全局变量数组 |

**返回值**: 更新后的新 `Schema`

## 工具方法

### combineSchema

组合 elements、layout 等数据生成完整的 Schema。

```typescript
const schema = SchemaUtils.combineSchema(
  elements,
  layout,
  extensions,
  flows,
  bindElements,
);
```

| 参数         | 类型                      | 说明         |
| ------------ | ------------------------- | ------------ |
| elements     | `Elements`                | 元素映射     |
| layout       | `LayoutTree`              | 布局树       |
| extensions   | `Record<string, unknown>` | 扩展数据     |
| flows        | `Flows`                   | 流程数据     |
| bindElements | `BindElement[]`           | 绑定元素数组 |

**返回值**: 组合后的 `Schema`

### normalizeSchema

规范化 Schema，确保所有字段都有默认值。

```typescript
const normalizedSchema = SchemaUtils.normalizeSchema(schema);
```

| 参数   | 类型     | 说明        |
| ------ | -------- | ----------- |
| schema | `Schema` | 原始 Schema |

**返回值**: 规范化后的 `Schema`

## 类型定义

### InsertElement

```typescript
interface InsertElement {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  hidden?: boolean;
}
```

### GlobalVariable

```typescript
interface GlobalVariable {
  name: string;
  description: string;
  type?: string;
  defaultValue?: string | boolean | number;
}
```
