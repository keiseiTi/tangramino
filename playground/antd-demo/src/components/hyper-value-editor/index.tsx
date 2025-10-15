import React from 'react';
import type { HyperValue } from '@/interfaces/hyper-value';
import { Select } from 'antd';

export interface HyperValueEditorProps {
  showTypes?: HyperValue['type'][];
  value?: HyperValue;
  onChange?: (value: HyperValue) => void;
}

const hyperValueOptions = [
  {
    label: '字符串',
    value: 'string',
  },
  {
    label: '数字',
    value: 'number',
  },
  {
    label: '布尔值',
    value: 'boolean',
  },
  {
    label: '空值',
    value: 'null',
  },
  {
    label: '表达式',
    value: 'expression',
  },
  {
    label: '代码',
    value: 'code',
  },
];

export const HyperValueEditor = (props: HyperValueEditorProps) => {
  const { value, onChange, showTypes } = props;

  const onTypeChange = (type: HyperValue['type']) => {
    if (onChange) {
      // onChange({ type, value: '' });
    }
  };

  if (showTypes?.length === 1) {

  }

    return (
      <>
        <Select options={hyperValueOptions} value={value?.type} onChange={onTypeChange} />
      </>
    );
};
