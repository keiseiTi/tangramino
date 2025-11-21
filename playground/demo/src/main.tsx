import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Engine from './engine';

import Home from './home';
import './main.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/engine',
    element: <Engine />,
  },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
