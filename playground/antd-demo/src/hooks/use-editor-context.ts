import { create } from 'zustand';

export const useEditorContext = create<{
  mode: 'view' | 'logic';
  setMode: (mode: 'view' | 'logic') => void;
}>((set) => ({
  mode: 'view',
  setMode: (mode) => set(() => ({ mode })),
}));
