import React from 'react';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Editor from './editor';
import Preview from './preview';
import '@tangramino/flow-editor/index.css';
import '@/components/code-editor/use-worker';
import zhCN from 'antd/lib/locale/zh_CN';
import './main.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Editor />,
    },
    {
      path: '/collab',
      element: (
        <Editor enableCollab collabServerUrl='http://localhost:3001' collabRoomId='demo-room' />
      ),
    },
    {
      path: '/preview',
      element: <Preview />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>,
);
