import React from 'react';

interface TextProps {
  text?: string;
  style?: React.CSSProperties;
}

export const Text = (props: TextProps) => {
  return <span style={props.style}>{props.text}</span>;
};
