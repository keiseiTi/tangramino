import React from 'react';

interface ButtonProps {
  title: string;
}

const Button = (props: ButtonProps) => {
  const { title, ...rest } = props;
  return (
    <button
      {...rest}
      className='rounded-sm border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900'
    >
      {title || '按钮'}
    </button>
  );
};

export default Button;
