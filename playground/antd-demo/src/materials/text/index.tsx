import React from 'react';

export interface IProps {
  text?: string;
}

export const Text = (props: IProps) => {
  const { text } = props;
  return <span>{text}</span>;
};
