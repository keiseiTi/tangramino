import { useEditorContext } from '../context/editor-context';

export const useActiveNode = () => {
  const { activeNode } = useEditorContext();
  return activeNode;
};
