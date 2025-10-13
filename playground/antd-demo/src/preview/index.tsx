import React from 'react';
import { Renderer } from '@/renderer';
import materialComponents from '@/materials';

const Preview = () => {
  const schema = JSON.parse(sessionStorage.getItem('schema') || '{}');
  return <Renderer schema={schema} components={materialComponents} className='w-full h-screen' />;
};

export default Preview;
