import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Tangramino',
  icon: '/tangramino.svg',
  logo: {
    light: '/tangramino.png',
    dark: '/tangramino.png',
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
