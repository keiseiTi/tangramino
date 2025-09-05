import React from 'react';
import { Editor } from '@tangramino/editor';
import materials from './materials';

const schema = sessionStorage.getItem('schema');

export default function App() {
  return (
    <div className='w-screen h-screen min-w-[980px] overflow-auto'>
      <Editor materials={materials} schema={schema ? JSON.parse(schema) : undefined} />
    </div>
  );
}
