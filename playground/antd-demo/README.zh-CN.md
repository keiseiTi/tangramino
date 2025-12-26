# Tangramino Antd 示例

**生产级低代码编辑器实现**

这是一个展示如何使用 Tangramino 包和 Ant Design 组件构建完整的低代码平台。

## 🎯 概览

此示例展示了功能完备的可视化页面构建器，包含：

- **25+ Ant Design 组件**：按钮、表单、表格、弹窗、抽屉、输入框、选择器、日期选择器等
- **拖放编辑器**：直观的物料面板和画布，支持可视化编辑
- **属性配置**：为所有组件提供动态属性面板
- **逻辑设计器**：用于复杂交互的可视化工作流编辑器
- **数据管理**：全局变量、数据源和上下文选项
- **生产特性**：撤销/重做、Schema 导出/导入、预览模式

## ✨ 特性

### 可视化编辑器

- 📦 **物料面板**：组织化的组件库，支持拖放操作
- 🎨 **画布**：实时可视化编辑，支持元素选择
- ⚙️ **属性面板**：上下文感知的属性配置
- 📐 **布局工具**：对齐、间距和定位控制

### 逻辑流程编辑器

- 🔀 **工作流设计器**：可视化逻辑编排
- 🎯 **逻辑节点**：
  - 接口请求（HTTP 调用）
  - 条件分支
  - 元素状态操作
  - 全局变量管理
  - 弹窗/抽屉操作
  - 自定义 JavaScript 执行

### 数据与状态

- 🌐 **全局变量**：应用级状态管理
- 📊 **数据源**：配置 API 端点和数据绑定
- 🔗 **上下文选项**：从 API 获取动态下拉选项
- 🔄 **事件系统**：组件交互和回调

## 🚀 快速开始

### 前置要求

- Node.js >= 16
- pnpm（推荐）或 npm

### 安装与运行

```bash
# 从项目根目录
pnpm install

# 启动示例
pnpm dev:antd

# 或进入示例目录
cd playground/antd-demo
pnpm dev
```

在浏览器中打开 [http://localhost:5173](http://localhost:5173)。

## 📁 项目结构

```
src/
├── components/          # 可复用 UI 组件
│   ├── code-editor/     # 基于 Monaco 的代码编辑器
│   ├── color-picker/    # 颜色选择组件
│   ├── function-editor/ # 函数/事件配置
│   ├── hyper-input/     # 支持动态值的高级输入
│   └── ...
├── editor/              # 主页面编辑器
│   ├── index.tsx        # 编辑器入口
│   └── mods/            # 编辑器模块
│       ├── attribute-panel.tsx    # 属性配置
│       ├── material-panel.tsx     # 组件库
│       ├── main-content.tsx       # 画布区域
│       ├── data-source-panel.tsx  # API 配置
│       └── ...
├── flow-editor/         # 逻辑流程编辑器
│   ├── index.tsx
│   ├── mods/            # 流程编辑器模块
│   └── nodes/           # 逻辑节点定义
│       ├── condition/
│       ├── interface-request/
│       ├── set-element-props/
│       └── ...
├── materials/           # 组件物料
│   ├── button/
│   ├── form/
│   ├── table/
│   ├── modal/
│   └── ...              # 25+ 组件
├── plugins/             # 编辑器插件
│   ├── material.ts      # 物料管理
│   ├── form.tsx         # 表单增强
│   └── portal.ts        # 弹窗/抽屉门户
├── renderer/            # 预览模式渲染器
└── preview/             # 预览页面
```

## 🎨 组件物料

### 基础组件

- **Button**：点击操作，支持多种变体（primary、default、dashed、link）
- **Text**：静态文本显示，支持排版选项
- **Container**：布局容器，支持 flex/grid
- **Input**：文本输入，支持验证
- **Number**：数字输入，支持步进控制
- **Textarea**：多行文本输入

### 表单组件

- **Form**：表单容器，支持验证
- **Select**：下拉选择（单选/多选）
- **Checkbox**：布尔值选择
- **Radio**：单项选择
- **DatePicker**：日期选择
- **DatePickerRange**：日期范围选择
- **TimePicker**：时间选择
- **Cascader**：级联选择
- **TreeSelect**：树形结构选择
- **Upload**：文件上传，支持预览

### 数据展示

- **Table**：数据表格，支持排序、筛选、分页
- **Tabs**：标签页界面
- **Tree**：层级数据显示

### 反馈

- **Modal**：对话框
- **Drawer**：侧边栏面板
- **FloatButton**：浮动操作按钮

### 高级组件

- **Slider**：范围选择
- **Switch**：开关控制

## 🔌 插件

### 物料插件

管理组件库并提供物料相关工具。

```typescript
// plugins/material.ts
export const materialPlugin = definePlugin({
  name: 'material',
  apply: (context) => {
    // 注册物料
    context.materials.forEach((material) => {
      registerMaterial(material);
    });
  },
});
```

### 表单插件

增强表单组件的验证和数据绑定能力。

```typescript
// plugins/form.tsx
export const formPlugin = definePlugin({
  name: 'form',
  apply: (context) => {
    // 注入表单上下文
    // 处理表单提交
    // 管理表单状态
  },
});
```

### 门户插件

管理画布外的弹窗和抽屉渲染。

```typescript
// plugins/portal.ts
export const portalPlugin = definePlugin({
  name: 'portal',
  apply: (context) => {
    // 处理弹窗/抽屉门户
  },
});
```

## 🛠️ 自定义

### 添加新组件

1. **创建物料定义**

```typescript
// materials/my-component/material-config.ts
export const myComponentMaterial = {
  type: 'myComponent',
  title: '我的组件',
  category: '自定义',
  Component: MyComponent,
  props: {
    // 默认属性
  },
};
```

2. **实现组件**

```tsx
// materials/my-component/index.tsx
export const MyComponent = ({ children, ...props }) => {
  return (
    <div className='my-component' {...props}>
      {children}
    </div>
  );
};
```

3. **注册物料**

```typescript
// materials/index.ts
import { myComponentMaterial } from './my-component/material-config';

export const materials = [
  // ... 现有物料
  myComponentMaterial,
];
```

### 添加逻辑节点

1. **定义节点**

```typescript
// flow-editor/nodes/my-node/index.tsx
export const myLogicNode: FlowNode = {
  type: 'myLogic',
  title: '我的逻辑',
  nodeMeta: {
    defaultPorts: [
      { id: 'in', type: 'input' },
      { id: 'out', type: 'output' }
    ]
  },
  renderNode: ({ data }) => (
    <div className="logic-node">
      {/* 节点 UI */}
    </div>
  ),
  execute: async (context, nodeData) => {
    // 逻辑执行
    return { success: true };
  }
};
```

2. **注册节点**

```typescript
// flow-editor/nodes/index.ts
import { myLogicNode } from './my-node';

export const logicNodes = [
  // ... 现有节点
  myLogicNode,
];
```

## 🔧 配置

### 环境变量

在示例目录中创建 `.env` 文件：

```env
# API 基础 URL
VITE_API_BASE_URL=https://api.example.com

# 启用调试模式
VITE_DEBUG=true
```

### 物料分类

在 `materials/group.ts` 中组织物料：

```typescript
export const materialGroups = {
  basic: ['button', 'text', 'container'],
  form: ['input', 'select', 'checkbox', 'radio'],
  data: ['table', 'tree'],
  feedback: ['modal', 'drawer'],
  // ... 自定义分类
};
```

## 📊 数据流

### 全局变量

定义和使用全局状态：

```typescript
// 在逻辑流程中设置
setGlobalVariable('userName', 'John Doe');

// 在组件中访问
const userName = useGlobalVariable('userName');
```

### 数据源

配置 API 端点：

```typescript
const dataSources = {
  userList: {
    url: '/api/users',
    method: 'GET',
    transform: (data) => data.users,
  },
};
```

### 上下文选项

从 API 获取动态选项：

```typescript
const contextOptions = {
  cities: {
    url: '/api/cities',
    valueField: 'id',
    labelField: 'name',
  },
};
```

## 🎯 使用场景

### 构建 CRUD 界面

1. 添加 **Table** 组件用于数据展示
2. 添加 **Button** 组件用于操作（新增、编辑、删除）
3. 添加带 **Form** 的 **Modal** 用于数据录入
4. 配置逻辑流程：
   - 页面加载时获取数据
   - 处理按钮点击打开弹窗
   - 提交表单到 API
   - 成功后刷新表格

### 创建多步骤表单

1. 添加 **Tabs** 组件
2. 在每个标签页中添加 **Form** 组件
3. 添加导航 **Buttons**
4. 配置逻辑：
   - 继续前验证当前步骤
   - 在全局变量中存储数据
   - 最后一步提交所有数据

### 构建仪表盘

1. 添加 **Container** 组件用于布局
2. 添加 **Table**、**Chart** 组件用于数据展示
3. 添加 **Select**、**DatePicker** 用于筛选
4. 配置逻辑：
   - 筛选变化时加载数据
   - 更新可视化组件
   - 处理实时更新

## 🧪 开发

### 开发模式

```bash
pnpm start
```

### 构建

```bash
pnpm build
```

## 📚 学习路径

1. **从简单开始**：拖拽几个组件到画布上
2. **配置属性**：点击元素并修改其属性
3. **添加交互**：为按钮点击创建逻辑流程
4. **管理数据**：设置全局变量和数据源
5. **构建复杂 UI**：组合组件和逻辑构建真实应用

## 🔗 相关资源

- **[Tangramino 文档](https://keiseiti.github.io/tangramino/)**
- **[Ant Design](https://ant.design/)**
- **[FlowGram.AI](https://flowgram.ai/)**

## 🤝 贡献

此示例既作为参考实现，也作为新功能的测试平台。欢迎贡献！

## 📄 许可证

MIT

---

**用 ❤️ 基于 Tangramino 构建**
