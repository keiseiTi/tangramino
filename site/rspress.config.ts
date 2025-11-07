import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: '/tangramino',
  title: 'Tangramino',
  description: '可视化低代码搭建',
  icon: '/tangramino/icon.svg',
  logo: {
    light: '/tangramino/logo.png',
    dark: '/tangramino/logo.png',
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
