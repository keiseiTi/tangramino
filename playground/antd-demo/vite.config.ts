import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: command === 'build' ? env.BASE_URL || '/' : '/',
    plugins: [react(), tailwindcss(), wasm()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          collab: resolve(__dirname, 'collab.html'),
          preview: resolve(__dirname, 'preview.html'),
        },
      },
    },
    server: {
      port: 7901,
    },
  };
});
