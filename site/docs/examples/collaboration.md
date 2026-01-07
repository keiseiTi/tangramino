# 协同编辑示例

基于 CRDT（冲突自由复制数据类型）技术和 WebSocket 实现实时多人协同编辑，支持多用户同时编辑同一文档而无需中央服务器协调。

## 核心特性

- **增量同步**：使用 Loro 的结构化 CRDT 容器，每次操作仅同步变更部分
- **实时同步**：基于 Loro CRDT 库实现的强一致性数据同步
- **离线支持**：用户离线时可继续编辑，重新连接后自动同步
- **冲突解决**：CRDT 算法自动解决并发编辑冲突
- **房间隔离**：支持多个独立的协同编辑会话
- **Peer 管理**：支持实时显示在线用户列表
- **自动重试**：连接失败时自动进行指数退避重试

## 增量同步架构

协同编辑插件将 Schema 结构映射到 Loro 的**扁平化键值存储**，利用**操作级钩子**实现真正的细粒度同步：

```
LoroMap (root)
├─ element_{id}_type: string
├─ element_{id}_props: JSON string
├─ element_{id}_hidden: boolean (可选)
├─ elementIds: JSON string (元素ID列表)
├─ layout_root: string
├─ structure_{parentId}: JSON string (子元素ID数组)
├─ flows: JSON string (可选)
└─ bindElements: JSON string (可选)
```

**扁平化设计理由**：Loro 的 `getOrCreateContainer()` 方法在嵌套使用时会返回 JsValue 容器引用而非普通对象，导致无法调用方法。扁平化键值存储避免了这个问题，所有值都直接存储在根 Map 中。

### 操作级钩子实现增量同步

插件系统的 Schema 钩子接收**操作级详细信息**而非仅最终 schema，使插件能够精确执行增量更新：

```typescript
onAfterInsert(schema, operation: InsertOperation) {
  // operation 包含：{ elementId, parentId, index, element }
  // 直接更新对应的扁平化键
  const rootMap = loroDoc.getMap('root');

  // 添加元素属性（扁平化键）
  rootMap.set(`element_${operation.elementId}_type`, operation.element.type);
  rootMap.set(`element_${operation.elementId}_props`, JSON.stringify(operation.element.props));
  if (operation.element.hidden !== undefined) {
    rootMap.set(`element_${operation.elementId}_hidden`, operation.element.hidden);
  }

  // 更新元素ID列表
  const elementIds = JSON.parse(rootMap.get('elementIds') || '[]');
  elementIds.push(operation.elementId);
  rootMap.set('elementIds', JSON.stringify(elementIds));

  // 更新结构（父子关系）
  const structureKey = `structure_${operation.parentId}`;
  const children = JSON.parse(rootMap.get(structureKey) || '[]');
  children.splice(operation.index, 0, operation.elementId);
  rootMap.set(structureKey, JSON.stringify(children));

  loroDoc.commit(); // 提交变更，触发增量同步
}
```

**优势：**

- 每次操作（insert/move/remove/updateProps）只更新对应的 Map/List 容器
- 避免全量序列化和差异计算的性能开销
- Loro 自动计算最小化的增量更新补丁（通常只有几十字节）
- 大幅减少网络传输和处理开销，支持高频编辑场景

**操作详情类型：**

```typescript
// 插入操作
interface InsertOperation {
  elementId: string;
  parentId: string;
  index: number;
  element: { type: string; props: Record<string, unknown>; hidden?: boolean };
}

// 移动操作
interface MoveOperation {
  elementId: string;
  oldParentId: string;
  oldIndex: number;
  newParentId: string;
  newIndex: number;
  mode: 'same-level' | 'cross-level';
}

// 删除操作
interface RemoveOperation {
  elementId: string;
  parentId: string;
  index: number;
  element: Element; // 完整快照，用于撤销
}

// 属性更新操作
interface UpdatePropsOperation {
  elementId: string;
  props: Record<string, unknown>;
  oldProps: Record<string, unknown>;
}
```

## 快速开始

### 安装依赖

协同编辑插件已内置 Loro CRDT 库，只需安装 Socket.IO 客户端：

```bash
npm install socket.io-client
```

### 启动协同编辑

```typescript
import { EditorProvider, collaborationPlugin } from '@tangramino/base-editor';
import { io } from 'socket.io-client';

const EditorPage = () => {
  const plugins = [
    collaborationPlugin({
      serverUrl: 'http://localhost:3001',
      roomId: 'my-document',
      peerId: 'user-123', // 可选
      autoConnect: true,  // 初始化时自动连接
      socketIO: io,       // Socket.IO 客户端
      maxRetries: 5,      // 最大重试次数（默认：5）
      retryDelay: 1000,   // 初始重试延迟（默认：1000ms）
    }),
  ];

  return (
    <EditorProvider
      materials={materials}
      schema={initialSchema}
      plugins={plugins}
    >
      <YourEditor />
    </EditorProvider>
  );
};
```

## 配置选项

### CollaborationOptions

| 选项          | 类型             | 必需 | 默认值   | 说明                       |
| ------------- | ---------------- | ---- | -------- | -------------------------- |
| `serverUrl`   | string           | ✅   | -        | WebSocket 协同服务器地址   |
| `socketIO`    | SocketIOClient   | ✅   | -        | Socket.IO 客户端工厂函数   |
| `roomId`      | string           | ✅   | -        | 协同编辑房间 ID            |
| `peerId`      | string \| bigint | ❌   | 随机生成 | 用户的唯一标识符           |
| `autoConnect` | boolean          | ❌   | true     | 初始化时是否自动连接服务器 |
| `maxRetries`  | number           | ❌   | 5        | 最大重试次数               |
| `retryDelay`  | number           | ❌   | 1000     | 初始重试延迟（毫秒）       |

## 插件 API

协同编辑插件在 `EditorProvider` 的上下文中提供以下扩展方法：

### 连接管理

```typescript
const { connect, disconnect, isConnected } = usePluginContext('collaboration');

// 手动连接
await connect();

// 手动断开连接
disconnect();

// 检查连接状态
if (isConnected()) {
  console.log('已连接到协同服务器');
}
```

### 增量更新方法

插件导出了细粒度的增量更新方法，允许直接操作 Loro 容器：

```typescript
const collab = usePluginContext('collaboration');

// 增量更新元素属性（仅同步属性变更）
collab.updateElementProps?.('elem-1', { width: 200, height: 100 });

// 增量插入元素（仅同步新元素）
collab.insertElement?.(
  'elem-2',
  { type: 'button', props: { text: 'Click me' } },
  'root',
  0, // 插入位置
);

// 增量移动元素（仅同步位置变更）
collab.moveElement?.('elem-1', 'old-parent', 'new-parent', 2);

// 增量删除元素（仅同步删除操作）
collab.removeElement?.('elem-1', 'parent-id');
```

:::tip 使用场景
默认情况下，插件会在 `onAfterInsert`、`onAfterMove` 等钩子中自动同步。
增量更新方法适用于需要精确控制同步时机和粒度的高级场景。
:::

### 信息查询

```typescript
const { getPeers, getRoomId } = usePluginContext('collaboration');

// 获取在线用户列表
const peers = getPeers(); // ['user-123', 'user-456']

// 获取当前房间 ID
const roomId = getRoomId(); // 'my-document'
```

## 后端部署

协同编辑需要后端服务处理房间管理和更新广播。

### 启动服务器

```bash
cd playground/collab-server

# 开发环境
npm run dev

# 生产环境
npm run build
npm run start
```

### 环境配置

```bash
# .env
PORT=3001
CORS_ORIGIN=http://localhost:7901
```

### 服务器 API

后端服务提供以下 REST 端点：

- **GET /health** - 健康检查，返回在线房间数
- **GET /rooms** - 列出所有房间及其连接数

### Socket.IO 事件

#### 客户端发送

| 事件           | 数据                         | 说明                   |
| -------------- | ---------------------------- | ---------------------- |
| `join-room`    | `{ roomId, peerId }`         | 加入协同编辑房间       |
| `sync-request` | `{ roomId, version? }`       | 请求文档快照或增量     |
| `update`       | `{ roomId, update, peerId }` | 发送本地编辑更新       |
| `init-schema`  | `{ roomId, snapshot }`       | 初始化空房间的文档状态 |

#### 服务器广播

| 事件            | 数据                               | 说明                           |
| --------------- | ---------------------------------- | ------------------------------ |
| `room-joined`   | `{ roomId, peers }`                | 成功加入房间，返回现有用户列表 |
| `sync-response` | `{ roomId, snapshot, isSnapshot }` | 返回文档快照或增量更新         |
| `remote-update` | `{ roomId, update, peerId }`       | 其他用户的编辑更新             |
| `peer-joined`   | `{ peerId }`                       | 新用户加入房间                 |
| `peer-left`     | `{ peerId }`                       | 用户离开房间                   |
| `sync-error`    | `{ error }`                        | 同步错误                       |

## 工作流程

### 初始化连接

1. 用户加载编辑器时，插件初始化 Loro 文档
2. 如果启用自动连接，立即连接到协同服务器
3. 建立 Socket 连接并发送 `join-room` 事件
4. 服务器返回 `room-joined` 事件，包含在线用户列表
5. 客户端发送 `sync-request` 请求文档状态
6. 服务器返回 `sync-response`，包含文档快照或增量

### 本地编辑同步

1. 用户在编辑器中进行操作（插入、移动、删除、更新属性）
2. SchemaUtils 方法返回 `{ schema, operation }` 对象
3. 插件的 `onAfterInsert/Move/Remove/UpdateProps` 钩子接收 operation 参数
4. **增量更新**：根据 operation 详情直接更新 Loro 扁平化键（而非全量序列化）
   - Insert: 设置 `element_{id}_*` 键，更新 `elementIds` 和 `structure_{parentId}`
   - Move: 从旧父的 `structure_{oldParentId}` 删除，在新父的 `structure_{newParentId}` 插入
   - Remove: 删除 `element_{id}_*` 键，从 `elementIds` 和 `structure_{parentId}` 删除
   - UpdateProps: 仅更新 `element_{id}_props`
5. 调用 `loroDoc.commit()` 提交变更
6. Loro 订阅回调触发，检测到 `event.by === 'local'`
7. Loro 文档自动导出为最小化的二进制 update（通常几十字节）
8. Update 通过 `update` 事件发送到服务器
9. 服务器接收 update，导入到房间的 Loro 文档
10. 服务器广播 `remote-update` 给其他在线客户端
11. 其他客户端导入 update 并更新本地编辑器 schema

### 远程更新接收

1. 客户端接收服务器的 `remote-update` 事件
2. **验证消息**：检查 peerId 格式、roomId 匹配、update 数据有效性
3. 提取更新数据并导入到本地 Loro 文档：`loroDoc.import(updateBytes)`
4. Loro 订阅回调触发，检测到 `event.by === 'import'`
5. 从扁平化键重建完整 schema：
   - 读取 `elementIds` 获取所有元素ID
   - 对每个ID读取 `element_{id}_type`、`element_{id}_props`、`element_{id}_hidden`
   - 读取所有 `structure_*` 键重建父子关系
6. 调用 `ctx.setSchema(schema)` 更新编辑器
7. 编辑器 UI 自动重新渲染，展示其他用户的编辑结果

### 错误恢复

1. **连接失败**：自动触发指数退避重试（1s → 2s → 4s → 8s → 16s）
2. **同步失败**：重新请求完整快照
3. **服务器断开**：自动重连并重新同步
4. **消息验证失败**：忽略无效消息并记录警告

## 高级用法

### 自定义 Peer ID

默认情况下，插件会随机生成 53 位整数作为 peerId。可以传入自定义值：

```typescript
collaborationPlugin({
  // ...
  peerId: 'user-' + currentUser.id, // 使用用户 ID
  // ...
});
```

### 延迟连接

如果需要稍后手动连接（例如等待用户授权）：

```typescript
const { connect } = usePluginContext('collaboration');

// 初始化时不连接
const plugins = [
  collaborationPlugin({
    // ...
    autoConnect: false,
  }),
];

// 用户授权后手动连接
const handleConnect = async () => {
  try {
    await connect();
    console.log('已连接');
  } catch (error) {
    console.error('连接失败:', error);
  }
};
```

### 自定义重试策略

```typescript
collaborationPlugin({
  // ...
  maxRetries: 10, // 最多重试 10 次
  retryDelay: 2000, // 初始延迟 2 秒
  // 实际延迟：2s, 4s, 8s, 16s, 32s, 64s, ...
});
```

### 监听连接事件

在 `onInit` 或其他生命周期中监听连接状态变化：

```typescript
const { isConnected, getPeers } = usePluginContext('collaboration');

useEffect(() => {
  const interval = setInterval(() => {
    if (isConnected()) {
      const peers = getPeers();
      console.log('在线用户:', peers);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

## 使用场景

适用于需要多人实时协作的场景，如：

- 👥 团队协作编辑页面布局
- 📝 共享文档协编
- 🎨 设计稿协同修改
- ⚙️ 流程编排多人参与

## 最佳实践

### 推荐做法

- 使用 UUID 或业务用户 ID 作为 peerId，便于用户识别
- 在关键操作前检查 `isConnected()` 状态
- 配置合理的重试策略，避免无限重试消耗资源
- 在生产环境部署多个协同服务器实例，使用负载均衡
- 定期持久化文档状态，防止服务器重启数据丢失

### 注意事项

- **持久化**：当前服务器仅将文档存储在内存中，建议集成 Redis/数据库
- **认证**：生产环境需添加房间访问权限控制
- **扩展性**：在线人数过多时，考虑实现更新订阅过滤（而非广播所有更新）
- **离线同步**：用户长时间离线后重新连接，可能有大量待同步更新
- **消息验证**：插件已内置 peerId、roomId 和数据格式验证

## 故障排除

### 连接失败

**症状**：`isConnected()` 始终返回 false

**排查步骤**：

1. 确认服务器正在运行：`GET http://localhost:3001/health`
2. 检查 `serverUrl` 是否正确
3. 检查浏览器控制台是否有 CORS 错误
4. 验证防火墙是否阻止 WebSocket 连接
5. 查看是否超过最大重试次数（默认 5 次）

### 数据不同步

**症状**：其他用户的编辑在本地看不到

**排查步骤**：

1. 检查 `isConnected()` 是否为 true
2. 查看浏览器网络标签，确认 Socket.IO 消息是否正常发送/接收
3. **检查事件名称**：客户端监听 `remote-update`，服务器广播 `remote-update`
4. 检查浏览器控制台中的 Loro 订阅日志：
   - 本地操作应显示 `event.by === 'local'`
   - 远程更新应显示 `event.by === 'import'`
5. 检查服务器日志中是否有 import 错误
6. 验证所有客户端连接的是同一个 `roomId`
7. 尝试手动调用 `disconnect()` 后重新 `connect()`

**常见问题**：

- **事件名不匹配**：确保客户端监听 `remote-update` 而非 `update`
- **Loro事件判断错误**：检查是否使用 `event.by` 而非 `event.origin` 或 `event.local`
- **初始同步标志**：确保 `isInitialSync` 在同步完成后设为 `false`

### 频繁重连

**症状**：连接不稳定，频繁断开重连

**排查步骤**：

1. 检查网络稳定性
2. 增加 `maxRetries` 和 `retryDelay` 配置
3. 检查服务器是否有资源限制（连接数、内存）
4. 查看服务器日志是否有异常断开记录

### 多个用户同时编辑时出现冲突

**说明**：这是正常行为，Loro CRDT 会自动解决冲突。每个用户都会看到一致的最终状态。

如果看到不同结果，检查：

1. Schema 序列化/反序列化逻辑是否正确
2. Loro 文档的导入/导出操作是否有异常
3. 服务器是否正确广播所有更新

## 示例项目

完整的协同编辑示例源码：

- **演练场地址**：[https://keiseiti.github.io/tangramino/playground/collab](https://keiseiti.github.io/tangramino/playground/collab)
- **前端源码**：[playground/antd-demo](https://github.com/keiseiti/tangramino/tree/main/playground/antd-demo/src/editor)
- **后端源码**：[playground/collab-server](https://github.com/keiseiti/tangramino/tree/main/playground/collab-server)

## 相关链接

- [Loro CRDT 官方文档](https://loro.dev/)
- [Socket.IO 文档](https://socket.io/docs/)
- [插件开发](../guide/plugin)
- [API 参考 - 协同编辑插件](../api/other/plugin#collaborationplugin)
