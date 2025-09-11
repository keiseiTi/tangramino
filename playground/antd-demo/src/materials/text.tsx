import React from 'react';
import { type Material } from '@tangramino/core';

export interface IProps {
  text?: string;
}

export const Text = (props: IProps) => {
  return <span>{props.text}</span>;
};

const TextMaterial: Material = {
  Component: Text,
  title: '文本',
  type: 'text',
  defaultProps: {
    text: '文本',
  },
};

export default TextMaterial;
