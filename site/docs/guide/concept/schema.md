# Schema

`Schema` 是用于描述页面的元素、布局、全局上下文、依赖导入以及交互逻辑流。渲染引擎会解析这些信息用于渲染视图，并结合逻辑流把事件与行为连接起来。

## 字段说明

- `elements`：元素状态集合，键为元素 ID，值为该元素的状态。用于驱动组件的运行时属性与显隐。
- `layout`：界面布局的树结构。`root` 指定根元素 ID；`structure` 为父 -> 子 ID 数组的映射，描述层级关系与渲染顺序。
- `imports`：依赖声明列表。每项包含 `name`、`description`、`version` 以及 `semverTag`（`lock` | `patch` | `minor` | `major`），可用于版本锁定与升级策略。
- `context`：运行时上下文设置。当前支持 `globalVariables?`，用于声明可注入的全局变量清单（见下文类型说明）。
- `flows`：逻辑流定义集合。每个 Flow 包含 `startId` 与 `nodes`（有向图的节点集合），用于描述事件触发后的执行路径。
- `bindElements`：把元素 `id` 与事件名 `event` 绑定到某个 `flowId`。当该元素触发事件时，执行对应逻辑流。
- `extensions`：开放的扩展存储，面向工具链或业务自定义数据。例如可存放 `flowGraph` 的可视化拓扑、编辑器状态等。引擎通过 `setExtensions/getExtensions` 读写；工具方法可约定子键以统一访问。

## 完整类型

```typescript
// schema 的类型
interface Schema {
  // 元素集合
  elements: {
    // 元素 ID，要求唯一
    [id: string]: {
      // 对应的组件类型
      type: string;
      // 组件的属性值
      props: { [key: string]: unknown };
      // 元素是否隐藏
      hidden?: boolean;
    };
  };
  // 页面布局
  layout: {
    // 根节点
    root: string;
    // 页面布局的树结构
    structure: { [key: string]: string[] };
  };
  // 依赖导入
  imports?: {
    // 名称
    name: string;
    // 描述
    description: string;
    // 版本
    version: string;
    // 语义化版本标签，lock 表示锁定版本，patch/minor/major 表示升级策略
    semverTag: 'lock' | 'patch' | 'minor' | 'major';
  }[];
  // 全局上下文
  context?: {
    // 全局变量
    globalVariables?: {
      name: string;
      description: string;
      type?: string;
      defaultValue?: string | boolean | number;
    }[];
  };
  // 元素事件绑定关系
  bindElements?: {
    // 元素id
    id: string;
    // 事件名
    event: string;
    // 流程id
    flowId: string;
  }[];
  // 逻辑流定义集合
  flows?: {
    [flowId: string]: {
      // 起始节点id
      startId: string;
      nodes: {
        [nodeId: string]: {
          // 节点id
          id: string;
          // 节点对应的类型
          type: string;
          // 节点的属性值
          props: Record<string, unknown>;
          // 上个节点id数组
          prev: string[];
          // 下一个节点id数组
          next: string[];
        };
      };
    };
  };
  // 扩展字段
  extensions: Record<string, unknown>;
}
```
