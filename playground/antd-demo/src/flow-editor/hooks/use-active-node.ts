import { useEditorContext } from '@tangramino/flow-editor';

export const useActiveNode = () => {
  const { activeNode } = useEditorContext();
  return activeNode;
};
