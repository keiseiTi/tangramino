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
      extract: 'index.css'
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
    'react-dom',
    'react/jsx-runtime',
    'nanoid',
    '@tangramino/engine',
    '@flowgram.ai/free-layout-editor',
  ],
});
