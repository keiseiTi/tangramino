# Tangramino - AI Coding Agent Instructions

## Project Overview

Tangramino is a **flexible, schema-driven low-code framework** for building visual editors and workflow designers. It provides a framework-agnostic JSON schema engine with React bindings, enabling developers to create drag-and-drop page editors and flow diagram designers.

**Key Capabilities:**
- Schema-driven architecture for defining UI structure, behavior, and data flow
- Framework-agnostic core engine (with React bindings provided)
- Production-ready visual editing tools (drag-and-drop, flow editor)
- Extensible plugin system for custom functionality

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.6+ (strict mode enabled)
- **Package Manager**: pnpm (workspace-based monorepo)
- **Build Tools**: 
  - Rollup (library bundling)
  - Vite (playground development)
  - TypeScript Compiler (type declarations)
- **Testing**: Vitest with jsdom environment
- **Linting**: ESLint 9+ (flat config), Prettier
- **Commit Convention**: Conventional Commits (@commitlint/config-conventional)

### Key Dependencies
- **State Management**: Immer (immutable updates), Zustand (editor state)
- **React**: React 18+ (peer dependency)
- **Drag & Drop**: @dnd-kit/core
- **Collaboration**: loro-crdt (optional)
- **Documentation Site**: Rspress

## Monorepo Structure

```
tangramino/
├── packages/              # Core libraries (published to npm)
│   ├── engine/           # Framework-agnostic JSON schema engine
│   ├── react/            # React bindings and view layer
│   ├── base-editor/      # Drag-and-drop visual editor
│   └── flow-editor/      # Flow diagram editor
├── playground/           # Demo applications
│   ├── antd-demo/       # Complete example with Ant Design
│   ├── demo/            # Basic demo
│   └── collab-server/   # Collaboration server
└── site/                # Documentation site (Rspress)
```

### Package Responsibilities

1. **@tangramino/engine** - Core logic layer
   - Schema management (flat structure for O(1) lookups)
   - Event system (pub/sub pattern)
   - State control with Immer
   - Zero UI dependencies

2. **@tangramino/react** - React integration
   - Component rendering from schema
   - React hooks for engine interaction
   - Plugin system for extending behavior

3. **@tangramino/base-editor** - Visual editor
   - Drag-and-drop via dnd-kit
   - Canvas management, selection, overlays
   - Material system for reusable components
   - History (undo/redo) support

4. **@tangramino/flow-editor** - Flow diagrams
   - Node-based workflow designer
   - Connection validation
   - Custom node renderers

## Build System & Scripts

### Development Workflow
```bash
# Install dependencies (always use pnpm)
pnpm install

# Development (runs playground)
pnpm dev              # Basic demo at localhost
pnpm dev:antd         # Ant Design demo at localhost:7901

# Build all packages
pnpm build            # Builds all @tangramino/* packages

# Watch mode for development
pnpm watch            # Watches all packages with Rollup + TSC

# Linting
pnpm lint             # ESLint on all packages

# Documentation
pnpm site             # Run docs site locally
pnpm site:build       # Build docs for production
```

### Package-Level Scripts
Each package in `packages/*` has:
- `pnpm build`: Rollup bundling + TypeScript declaration generation
- `pnpm watch`: Watch mode (parallel Rollup watch & TSC watch)
- `pnpm test`: Run Vitest tests

**Build Process:**
1. `rm -rf dist types` - Clean old builds
2. `rollup -c` - Bundle source code to dist/
3. `tsc -p tsconfig.json` - Generate type declarations to types/

### Output Structure
- **dist/**: CJS (`index.cjs`) and ESM (`index.js`) bundles
- **types/**: TypeScript declaration files (`.d.ts`)
- **src/**: Original source (included in npm package for sourcemaps)

## Coding Standards

### TypeScript Rules (STRICTLY ENFORCED)

**Type Safety:**
- ✅ Explicit return types on ALL functions
- ✅ Explicit types for state and props
- ❌ Never use `any` or `unknown` (unless unavoidable)
- ✅ Prefer `interface` over `type` for object definitions
- ✅ Strict mode enabled (noUncheckedIndexedAccess, exactOptionalPropertyTypes)

**Module System:**
- Use `verbatimModuleSyntax: true` (import type { ... })
- ES modules only (`type: "module"` in package.json)

### React Best Practices

**Component Structure:**
- ✅ Functional components only (no class components)
- ✅ Use Hooks: `useEffect`, `useCallback`, `useMemo`, `useState`
- ✅ Extract complex logic to custom hooks (in `src/hooks/`)
- ✅ Keep business logic out of components (use `src/utils/`)
- ❌ No raw `fetch` in `useEffect` (abstract to custom hooks or utils)

**Naming Conventions:**
- camelCase for variables, functions
- PascalCase for components, interfaces, types
- UPPER_SNAKE_CASE for constants

**Variable Declarations:**
- Default to `const`, use `let` only when reassignment needed
- Never use `var`

### Styling
- **Tailwind CSS** preferred (used in playground/antd-demo)
- **CSS Modules** for package stylesheets
- Avoid global `<style>` tags

## Project-Specific Patterns

### Schema Architecture
Schemas use a **flat element structure** for performance:
```typescript
{
  elements: { [id: string]: ElementState },  // O(1) lookup
  layout: { root: string, structure: { [parent]: [children] } }
}
```

### Event System
Engine uses pub/sub pattern:
```typescript
engine.on(namespace, eventType, handler)
engine.emit(namespace, eventType, payload)
```

Common events: `ELEMENT_UPDATE`, `VIEW_UPDATE`

### Plugin System
- Define plugins with `definePlugin()` utility
- Plugins can extend editor/react functionality
- Validate dependencies with `validatePluginDependencies()`

## Git Workflow & Commits

### Commit Message Format
Follow **Conventional Commits**:
```
<type>(<scope>): <subject>

Examples:
feat(engine): add drag and drop support
fix(editor): resolve canvas rendering issue
docs: update contribution guide
refactor(react): simplify plugin architecture
test(engine): add schema utils tests
chore: update dependencies
```

**Types:** feat, fix, docs, style, refactor, perf, test, chore

### Husky Hooks
- Pre-commit: Runs linting/formatting checks
- Commit-msg: Validates conventional commit format

## Common Pitfalls to Avoid

1. **Don't mix package managers** - Always use `pnpm`, never `npm` or `yarn`
2. **Don't skip type generation** - Run full build, not just Rollup
3. **Don't import from dist/** - Import from `src/` during development
4. **Don't use workspace:*** in published packages - Build process resolves these
5. **External dependencies** - Check `rollup.config.js` external array (React, dnd-kit, etc. should NOT be bundled)
6. **pnpm -F (filter)** - Use `-F` to run commands in specific packages:
   - `pnpm -F @tangramino/engine build`
   - `pnpm -F playground-antd-demo dev`

## Testing Guidelines

- Use Vitest with jsdom environment (configured in `vitest.config.ts`)
- Setup file: `src/__tests__/setup.ts`
- Run tests per package or across all packages
- React components: Use @testing-library/react

## Working with the Codebase

### Adding a New Feature to Engine
1. Add types to `src/interfaces/`
2. Implement logic in `src/`
3. Export from `src/index.ts`
4. Add tests in `src/__tests__/`
5. Build: `pnpm build`

### Creating a New Plugin
1. Define plugin in appropriate package (`packages/base-editor/src/plugins/` or `packages/react/src/`)
2. Use `definePlugin()` helper
3. Export from package `index.ts`
4. Document in README

### Updating Dependencies
- Use workspace protocol: `"@tangramino/engine": "workspace:*"`
- Check peer dependencies (React version, etc.)

## Documentation

- **Main README**: Overview, quick start, architecture
- **Package READMEs**: API reference for each package
- **contribution.md**: Detailed contribution guide
- **Site (Rspress)**: Full documentation at `site/docs/`

## Key Files to Review

- `packages/engine/src/create-engine.ts` - Engine initialization
- `packages/react/src/view.tsx` - React view rendering
- `packages/base-editor/src/provider.tsx` - Editor context provider
- `playground/antd-demo/` - Complete working example
- `contribution.md` - Full development guidelines

## Quick Reference

**Check current package versions:**
```bash
cat package.json | grep version
```

**Add dependency to a package:**
```bash
pnpm -F @tangramino/engine add <package-name>
```

**Verify builds:**
```bash
pnpm build && ls packages/*/dist packages/*/types
```

**Run playground to test changes:**
```bash
pnpm dev:antd  # Most comprehensive demo
```
