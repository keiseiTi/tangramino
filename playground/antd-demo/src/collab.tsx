import React from 'react';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import Editor from './editor';
import '@tangramino/flow-editor/index.css';
import '@/components/code-editor/use-worker';
import zhCN from 'antd/lib/locale/zh_CN';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <Editor enableCollab collabServerUrl='http://localhost:3001' collabRoomId='demo-room' />
  </ConfigProvider>,
);
