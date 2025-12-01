# 贡献指南

感谢你对 Tangramino 的关注！我们非常欢迎社区贡献，共同打造一个高度可扩展的低代码编辑器。

## 🛠 开发环境准备

本项目使用 pnpm 作为包管理器，并采用 Monorepo 架构。

### 1. 前置依赖

- Node.js (推荐 LTS 版本)
- pnpm

### 2. 安装依赖

在项目根目录下运行：

```bash
pnpm install
```

### 3. 启动开发环境

本项目包含多个演示环境，你可以根据需要启动：

- **基础演示**：
  ```bash
  pnpm dev
  ```
- **Ant Design 演示**（功能更完整）：
  ```bash
  pnpm dev:antd
  ```

### 4. 构建项目

构建所有核心包：

```bash
pnpm build
```

## 📂 项目结构

- `packages/`：核心包目录
  - `base-editor`：基础编辑器核心
  - `engine`：核心引擎逻辑
  - `flow-editor`：流程编辑器
  - `react`：React 适配层
- `playground/`：演示与调试应用
  - `antd-demo`：基于 Ant Design 的完整演示
  - `demo`：基础演示

## 📝 代码规范

为了保持代码质量和风格统一，请遵守以下开发规范：

### React 组件规范

- **组件形式**：必须使用 **函数式组件**，禁止使用 Class 组件。
- **Hooks**：优先使用 Hooks（`useEffect`, `useCallback`, `useMemo`）管理逻辑。
- **逻辑抽离**：避免在组件内直接编写复杂业务逻辑，应抽离到自定义 Hook 或 `src/utils/` 下的工具函数中。
- **副作用**：禁止直接在 `useEffect` 中裸写 `fetch` 请求。

### TypeScript 规范

- **类型优先**：优先使用 TypeScript。若必须使用 JS，需添加完整的 JSDoc 注释。
- **状态声明**：所有 State 必须显式声明类型，例如 `useState<string>('')`。
- **Props 定义**：Props 必须使用 `interface` 或 `type` 显式定义，**禁止**使用 `any` 或隐式类型。
- **接口定义**：优先使用 `interface` 描述对象结构，`type` 用于联合类型等。
- **函数返回类型**：所有函数必须标注返回类型，以提高可读性和类型推导稳定性。
- **严禁 Any**：禁止使用 `any` 或 `unknown`（除非绝对必要），必须提供精确类型。
- **枚举**：使用 `enum` 时优先考虑 `const enum` 或字符串字面量联合类型。

### 命名与变量

- **命名风格**：变量和函数命名必须使用 **camelCase**（驼峰命名法），且语义清晰。
- **变量声明**：禁止使用 `var`，统一使用 `const` 或 `let`。

### 样式规范

- **方案**：使用 **Tailwind CSS** 进行样式管理。
- **禁止**：禁止使用全局 `<style>` 标签。

### 工具函数

- **位置**：工具函数应放置在 `src/utils/` 目录下。
- **纯函数**：必须导出为纯函数，并带有完整的类型定义。

## 🎨 提交规范

本项目启用 Commitlint 检查，Commit Message 需遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

格式：`<type>(<scope>): <subject>`

常用 Type：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式调整（不影响逻辑）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链/依赖更新

示例：

```text
feat(engine): add drag and drop support
fix(editor): fix canvas rendering issue
docs: update contribution guide
```

## 🤝 提交 PR

1. Fork 本仓库。
2. 基于 `main` 分支创建一个新的分支。
3. 提交代码并确保通过 Lint 检查。
4. 提交 Pull Request，并详细描述你的变更内容。

再次感谢你的贡献！
