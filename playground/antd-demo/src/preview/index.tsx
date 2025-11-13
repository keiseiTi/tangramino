import React from 'react';
import { Renderer } from '@/renderer';
import materialComponents from '@/materials';
import { logicNodes } from '@/flow-editor/nodes/logic-nodes';

const Preview = () => {
  const schema = JSON.parse(sessionStorage.getItem('tg_schema') || '{}');

  return (
    <Renderer
      schema={schema}
      components={materialComponents}
      logicNodes={logicNodes}
      className='w-full h-screen'
    />
  );
};

export default Preview;
