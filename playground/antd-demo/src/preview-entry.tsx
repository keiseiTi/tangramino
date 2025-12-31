import React from 'react';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import Preview from './preview';
import zhCN from 'antd/lib/locale/zh_CN';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <Preview />
  </ConfigProvider>,
);
