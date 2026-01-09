import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: '/tangramino',
  title: 'Tangramino',
  description: 'Tangramino 可视化低代码搭建 LowCode 平台，支持多人协同开发。',
  icon: '/icon.svg',
  logoText: 'Tangramino',
  logo: {
    light: '/logo.png',
    dark: '/logo.png',
  },
  head: [
    '<meta name="google-site-verification" content="29-9koS6Iq6wX-a_UpdGx3b8CF6xsL3nXQXam3WZ2cE" />',
    '<meta name="keyword" content="Tangramino,lowCode,低代码,多人协同,可视化搭建" />',
  ],
  themeConfig: {
    outlineTitle: '大纲',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/keiseiTi/tangramino',
      },
    ],
  },
});
