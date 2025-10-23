import React from 'react';
import type { FlowGraphData } from '../interface/node';

export const Wrapper = ({
  children,
}: {
  children: React.ReactNode;
  value?: FlowGraphData | undefined;
}) => {
  return children;
};
