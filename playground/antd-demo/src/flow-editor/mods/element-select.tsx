import React from 'react';
import { Select } from 'antd';
import { useEditorCore } from '@tangramino/core';

export const ElementSelect = () => {
  const editorCore = useEditorCore();

  return (
    <>
      <Select />
    </>
  );
};
