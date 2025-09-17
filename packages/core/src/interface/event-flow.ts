export interface EventFlowConfig {
  event: string;
  description?: string;
  params?: {
    description: string;
    fields?: Record<string, unknown>;
  }[];
}
