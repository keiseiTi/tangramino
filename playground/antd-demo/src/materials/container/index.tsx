import React from 'react';

export interface IProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
}

export const Container = (props: IProps) => {
  return <div style={{ margin: props.margin, padding: props.padding }}>{props.children}</div>;
};
