import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import '@ant-design/v5-patch-for-react-19';
import Editor from './editor';
import Preview from './preview';
import './main.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Editor />,
  },
  {
    path: '/preview',
    element: <Preview />,
  },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
