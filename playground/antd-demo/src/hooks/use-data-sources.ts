import { create } from 'zustand';
import { uniqueId } from '@tangramino/base-editor';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface FieldConfig {
  id: string;
  name: string;
  type: FieldType;
  description?: string;
  required?: boolean; // 仅用于请求参数
  children?: FieldConfig[]; // 当type为object或array时的子字段
}

export interface DataSourceItem {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  requestParams?: FieldConfig[]; // 请求参数配置
  responseParams?: FieldConfig[]; // 返回参数配置
}

interface UseDataSourcesState {
  sources: DataSourceItem[];
  addSource: (payload: Omit<DataSourceItem, 'id'>) => {
    success: boolean;
    id?: string;
    error?: string;
  };
  updateSource: (
    id: string,
    changes: Partial<Omit<DataSourceItem, 'id' | 'name'>>,
  ) => { success: boolean; error?: string };
  deleteSource: (id: string) => { success: boolean };
  replaceAll: (next: DataSourceItem[]) => void;
}

const STORAGE_KEY = 'tg_data_sources';

const readStorage = (): DataSourceItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DataSourceItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStorage = (list: DataSourceItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

export const useDataSources = create<UseDataSourcesState>((set, get) => ({
  sources: readStorage(),
  addSource: (payload) => {
    const current = get().sources;
    const exists = current.some((s) => s.name === payload.name);
    if (exists) {
      return { success: false, error: '接口名已存在' };
    }
    const id = 'ds_' + uniqueId(undefined, 8);
    const next = [...current, { id, ...payload }];
    writeStorage(next);
    set({ sources: next });
    return { success: true, id };
  },
  updateSource: (id, changes) => {
    const current = get().sources;
    const idx = current.findIndex((s) => s.id === id);
    if (idx < 0) return { success: false, error: '未找到数据源' };
    const target = current[idx];
    const updated: DataSourceItem = { ...target, ...changes };
    const next = [...current.slice(0, idx), updated, ...current.slice(idx + 1)];
    writeStorage(next);
    set({ sources: next });
    return { success: true };
  },
  deleteSource: (id) => {
    const current = get().sources;
    const next = current.filter((s) => s.id !== id);
    writeStorage(next);
    set({ sources: next });
    return { success: true };
  },
  replaceAll: (next) => {
    writeStorage(next);
    set({ sources: next });
  },
}));
