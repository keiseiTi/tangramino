import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import vitePluginImp from 'vite-plugin-imp';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? (process.env.BASE_URL || '/') : '/',
    plugins: [
      react(),
      tailwindcss(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      }),
    ],
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
