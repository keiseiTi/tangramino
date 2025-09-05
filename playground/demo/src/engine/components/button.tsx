import React from 'react';

interface ButtonProps {
  text?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const Button = (props: ButtonProps) => {
  return (
    <button onClick={props.onClick} className='border-1 border-gray-500 p-1' style={props.style}>
      {props.text}
    </button>
  );
};
