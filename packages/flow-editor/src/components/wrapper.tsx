import React from 'react';
// import { useClientContext } from '@flowgram.ai/free-layout-editor';
import type { FlowGraphData } from 'src/interface/node';

export const Wrapper = ({
  children,
}: {
  children: React.ReactNode;
  value?: FlowGraphData | undefined;
}) => {
  // const client = useClientContext();

  // useEffect(() => {
  //   if (value) {
  //     client.document.fromJSON(value);
  //     setTimeout(() => {
  //       client.tools.fitView(true);
  //     })
  //   }

  return children;
};
