import React from 'react';

export interface IProps {
  text?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
}

export const Text = (props: IProps) => {
  const { text, fontSize = 14, color = '#000000', backgroundColor = 'transparent', bold = false, italic = false } = props;

  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    color,
    backgroundColor,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
  };

  return <span style={style}>{text}</span>;
};
