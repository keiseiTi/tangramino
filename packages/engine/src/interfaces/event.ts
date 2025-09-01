export type Listener = (...args: unknown[]) => unknown;

export type ListenerMap = {
  [event_name: string]: Listener[];
};
