import React from 'react';

export interface IProps {
  children?: React.ReactNode;
}

export const Container = (props: IProps) => {
  return <div>{props.children}</div>;
};
