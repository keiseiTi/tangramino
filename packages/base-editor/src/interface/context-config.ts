export type Variable = {
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  description?: string;
};

export type ContextValue = {
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 是否为方法
   */
  isMethod?: boolean;
};

export type Method = {
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 参数
   */
  params?: {
    /**
     * 参数描述
     */
    description: string;
    /**
     * 参数字段
     */
    fields?: Record<string, unknown>;
  }[];
};

export interface ContextConfig {
  /**
   * 变量
   *
   * 在编辑器中设置变量值
   *
   */
  variables?: Variable[];
  /**
   * 方法
   *
   * 在编辑器中配置方法逻辑流程
   *
   */
  methods?: Method[];
  /**
   * 上下文值
   *
   * 在编辑器配置上下文值
   *
   */
  contextValues?: ContextValue[];
}
