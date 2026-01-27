import { defineConfig } from '@rspress/core';
import ga from 'rspress-plugin-google-analytics';

export default defineConfig({
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
  lang: 'zh',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/keiseiTi/tangramino',
      },
    ],
    footer: {
      message: '@2026 Tangramino',
    },
  },
  plugins: [
    ga({
      id: 'G-SCTQB72YNV',
    }),
  ],
});
