import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: '/tangramino',
  title: 'Tangramino',
  description: '可视化低代码搭建',
  icon: '/icon.svg',
  logo: {
    light: '/logo.png',
    dark: '/logo.png',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/keiseiTi/tangramino',
      },
    ],
  },
});
