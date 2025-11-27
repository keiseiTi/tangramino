import React, { useMemo } from 'react';
import { Select } from 'antd';
import { useEditorCore } from '@tangramino/base-editor';

interface IProps {
  value?: string[] | string;
  onChange?: (value?: string[] | string) => void;
  mode?: 'multiple';
}

export const ElementSelect = (props: IProps) => {
  const { engine, materials, activeElement } = useEditorCore();

  const elements = engine.getElements();

  const filterSelfElements = useMemo(() => {
    return elements.filter(
      (element) => element.id !== activeElement?.id && element.type !== 'basicPage',
    );
  }, [elements, activeElement]);

  return (
    <>
      <Select
        mode={props.mode}
        value={props.value}
        onChange={props.onChange}
        options={filterSelfElements.map((element) => ({
          label: `${materials.find((material) => material.type === element.type)?.title} (${element.id})`,
          value: element.id,
        }))}
      />
    </>
  );
};
