import React, { useEffect, useState } from 'react';
import type { HyperValue } from '@/interfaces/hyper-value';
import { Input, InputNumber, Radio, Select } from 'antd';
import { FunctionEditor } from '../function-editor';

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

export const HyperInput = (props: HyperValueEditorProps) => {
  const { value, onChange, showTypes } = props;
  const [inputType, setInputType] = useState<HyperValue['type']>();

  useEffect(() => {
    if (showTypes?.length && !value?.type) {
      setInputType(showTypes[0]);
    } else {
      setInputType(value?.type || 'string');
    }
  }, [value?.type, showTypes]);

  const onTypeChange = (type: HyperValue['type']) => {
    setInputType(type);
    onChange?.({ type, value: value?.value as any });
  };

  const renderInput = () => {
    switch (inputType) {
      case 'string':
        return (
          <Input
            value={value?.value as string}
            onChange={(e) => {
              onChange?.({ type: inputType, value: e.target.value });
            }}
          />
        );
      case 'number':
        return (
          <InputNumber
            value={value?.value as number}
            style={{ width: '100%' }}
            onChange={(e) => {
              onChange?.({ type: inputType, value: e });
            }}
          />
        );
      case 'boolean':
        return (
          <Radio.Group
            value={value?.value as boolean}
            onChange={(e) => {
              onChange?.({ type: inputType, value: e.target.value });
            }}
          >
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        );
      case 'expression':
        return (
          <Input.TextArea
            value={value?.value as string}
            onChange={(e) => {
              onChange?.({ type: inputType, value: e.target.value });
            }}
          />
        );
      case 'code':
        return (
          <FunctionEditor
            value={value?.value as string}
            onChange={(e) => {
              onChange?.({ type: inputType, value: e });
            }}
          />
        );
    }
  };

  return (
    <>
      {showTypes?.length !== 1 && (
        <Select
          className='mb-2!'
          options={
            showTypes?.length
              ? hyperValueOptions.filter((item) =>
                  showTypes.includes(item.value as HyperValue['type']),
                )
              : hyperValueOptions
          }
          value={inputType}
          onChange={onTypeChange}
        />
      )}
      {renderInput()}
    </>
  );
};
