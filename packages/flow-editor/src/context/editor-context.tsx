import React, { useState } from 'react';
import type { ActiveNode, EditorContextValue } from '../interface/context';
import type { FlowNode } from '../interface/node';

export const EditorContext = React.createContext<EditorContextValue>({
  activeNode: null,
  nodes: [],
  setActiveNode: () => {},
});

export const EditorContextProvider = ({
  children,
  nodes,
}: {
  children: React.ReactNode;
  nodes: FlowNode[];
}) => {
  const [activeNode, setActiveNode] = useState<ActiveNode | null>(null);

  return (
    <EditorContext.Provider value={{ activeNode, setActiveNode, nodes }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => React.useContext(EditorContext);
