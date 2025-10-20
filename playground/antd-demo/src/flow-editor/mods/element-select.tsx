import React from 'react';
import { Select } from 'antd';
import { useEditorCore } from '@tangramino/core';

interface IProps {
  value?: string[];
  onChange?: (value?: string[]) => void;
}

export const ElementSelect = (props: IProps) => {
  const { engine } = useEditorCore();

  const elements = engine.getElements();

  return (
    <>
      <Select
        mode='multiple'
        value={props.value}
        onChange={props.onChange}
        options={elements.map((element) => ({
          label: element.props.alias || element.id,
          value: element.id,
        }))}
      />
    </>
  );
};
