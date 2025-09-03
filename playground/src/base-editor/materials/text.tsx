import React from 'react';

interface TextProps {
  text: string;
}

const Text = (props: TextProps) => {
  return <span>{props.text}</span>;
};

export default Text;
