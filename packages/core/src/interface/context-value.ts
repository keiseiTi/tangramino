export type Variable = {
  name: string;
  description: string;
};

export type Method = {
  name: string;
  description: string;
  params: {
    name: string;
    description: string;
  }[];
};

export interface ContextValue {
  /**
   * 变量
   */
  variables: Variable[];
  /**
   * 方法
   */
  methods: Method[];
}
