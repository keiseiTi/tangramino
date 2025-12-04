# Contributing to Tangramino

Thank you for your interest in contributing to Tangramino! We welcome contributions from the community to help make this project better.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/keiseiti/tangramino.git
cd tangramino
pnpm install
```

## Project Structure

This project is a monorepo managed by [pnpm workspaces](https://pnpm.io/workspaces).

- **`packages/engine`**: The core schema engine handling data, events, and logic. Framework-agnostic.
- **`packages/react`**: React bindings and view layer for the engine.
- **`packages/base-editor`**: A visual drag-and-drop editor component.
- **`packages/flow-editor`**: A specialized visual flow editor component.
- **`playground/antd-demo`**: A complete example application demonstrating how to build a low-code editor using Tangramino and Ant Design.
- **`site`**: The documentation site.

## Running the Playground

To see the changes in action, you can run the playground example:

```bash
cd playground/antd-demo
pnpm run dev
```

Open your browser and navigate to the local server URL (usually `http://localhost:5173`).

## Running Tests

We use [Vitest](https://vitest.dev/) for testing. To run the tests:

```bash
# Run all tests
pnpm test

# Run tests for a specific package
cd packages/engine
pnpm test
```

## 📝 Coding Standards

To maintain code quality and consistency, please adhere to the following standards:

### React Components

- **Functional Components Only**: Do not use Class components.
- **Hooks**: Prefer Hooks (`useEffect`, `useCallback`, `useMemo`) for logic management.
- **Logic Separation**: Avoid complex business logic inside components. Extract it to custom Hooks or utility functions in `src/utils/`.
- **Side Effects**: Do not write raw `fetch` calls directly in `useEffect`.

### TypeScript

- **Explicit Types**: Always define explicit types for state and props.
- **No Any**: Avoid `any` or `unknown` unless absolutely necessary.
- **Interfaces**: Prefer `interface` over `type` for object definitions.
- **Return Types**: All functions must have explicit return types.
- **Strict Mode**: Ensure no implicit `any`.

### Naming & Variables

- **CamelCase**: Use camelCase for variable and function names.
- **Const/Let**: Use `const` by default, `let` only when reassignment is needed. No `var`.

### Styles

- **Tailwind CSS** or **CSS Modules**: Avoid global `<style>` tags.

### Utils

- **Pure Functions**: Utility functions should be pure and placed in `src/utils/`.

## 🎨 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

Format: `<type>(<scope>): <subject>`

Common Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi colons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding missing tests
- `chore`: Build process or auxiliary tool changes

Example:
```text
feat(engine): add drag and drop support
fix(editor): fix canvas rendering issue
docs: update contribution guide
```

## 🤝 Pull Request Process

1.  **Fork the repository** to your own GitHub account.
2.  **Create a new branch** for your feature or bugfix: `git checkout -b feature/my-awesome-feature`.
3.  **Commit your changes** following the commit guidelines.
4.  **Push to your branch**: `git push origin feature/my-awesome-feature`.
5.  **Open a Pull Request** against the `main` branch of the original repository.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](../../LICENSE).
