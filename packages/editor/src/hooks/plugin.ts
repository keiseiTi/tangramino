import { create } from 'zustand';
import type { Plugin } from '../interface/plugin';

interface PluginStore {
  plugins: Plugin[];
  addPlugin: (plugin: Plugin) => void;
}

export const usePluginStore = create<PluginStore>((set) => ({
  plugins: [],
  addPlugin: (plugin: Plugin) => set((state) => ({ plugins: [...state.plugins, plugin] })),
}));

export const usePluginContext = <T extends Plugin>(id: string): T => {
  const plugin = usePluginStore((state) => state.plugins.find((plugin) => plugin.id === id)) as T;
  return plugin;
};
