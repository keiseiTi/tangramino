import React from 'react';

export interface IProps {
  text?: string;
  margin?: number | string;
  padding?: number | string;
}

export const Text = (props: IProps) => {
  const { text, margin, padding } = props;
  return (
    <span style={{ margin, padding }}>
      {text}
    </span>
  );
};
