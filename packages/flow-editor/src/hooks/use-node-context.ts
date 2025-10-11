import { useNodeRender } from '@flowgram.ai/free-layout-editor';

export const useNodeContext = () => {
  const nodeContext = useNodeRender();

  return {
    data: nodeContext.data,
  };
};
