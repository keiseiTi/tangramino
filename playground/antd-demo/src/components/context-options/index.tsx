import React, { useState } from 'react';
import { Select } from 'antd';
import { useContextOptions } from '@/hooks/use-context-options';

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const ContextOptions = (props: IProps) => {
  const { value, onChange } = props;
  const { variableOptions } = useContextOptions();

  return <Select value={value} options={variableOptions} onChange={onChange} allowClear={true} />;
};
