import React from 'react';

interface ContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container = (props: ContainerProps) => {
  return <div style={props.style}>{props.children}</div>;
};
