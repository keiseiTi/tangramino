import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    postcss({
      extract: 'style.css',
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      emitDeclarationOnly: false,
      outDir: 'dist',
    }),
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    commonjs({
      include: /node_modules/,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ],
  external: [
    'react',
    'react/jsx-runtime',
    '@dnd-kit/core',
    '@radix-ui',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-select',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip',
    '@tangramino/engine',
    '@tangramino/react',
    'class-variance-authority',
    'clsx',
    'lucide-react',
    'nanoid',
    'tailwind-merge',
    'tw-animate-css',
    'zustand',
  ],
});
