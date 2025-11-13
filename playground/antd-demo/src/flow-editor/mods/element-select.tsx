import React from 'react';
import { Select } from 'antd';
import { useEditorCore } from '@tangramino/base-editor';

interface IProps {
  value?: string[] | string;
  onChange?: (value?: string[] | string) => void;
  mode?: 'multiple';
}

export const ElementSelect = (props: IProps) => {
  const { engine, materials } = useEditorCore();

  const elements = engine.getElements();

  return (
    <>
      <Select
        mode={props.mode}
        value={props.value}
        onChange={props.onChange}
        options={elements.map((element) => ({
          label: `${materials.find((material) => material.type === element.type)?.title} (${element.id})`,
          value: element.id,
        }))}
      />
    </>
  );
};
