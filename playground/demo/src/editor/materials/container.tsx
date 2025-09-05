import React from 'react';

const Container = (props) => {
  const { children, dropPlaceholder, ...rest } = props;
  return <div {...rest} className='h-100'>{props.children || dropPlaceholder}</div>;
};

export default Container;
