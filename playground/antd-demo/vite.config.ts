import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm';

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
    server: {
      port: 7901,
    },
  };
});
