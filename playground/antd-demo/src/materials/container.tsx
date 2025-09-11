import React from 'react';
import { type Material } from '@tangramino/core';

export interface IProps {
  children?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
}

export const Container = (props: IProps) => {
  return <div style={{ margin: props.margin, padding: props.padding }}>{props.children}</div>;
};

const ContainerMaterial: Material = {
  Component: Container,
  title: '容器',
  type: 'container',
  isContainer: true,
};

export default ContainerMaterial;
