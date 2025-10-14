import React from 'react';
// import { useClientContext } from '@flowgram.ai/free-layout-editor';
import type { FlowGraphData } from 'src/interface/node';

export const Wrapper = ({
  children,
  // flowGraphData,
}: {
  children: React.ReactNode;
  flowGraphData?: FlowGraphData | undefined;
}) => {
  // const client = useClientContext();

  // useEffect(() => {
  //   if (flowGraphData) {
  //     client.document.fromJSON(flowGraphData);
  //     setTimeout(() => {
  //       client.tools.fitView(true);
  //     })
  //   }
  // }, [client, flowGraphData]);

  return children;
};
