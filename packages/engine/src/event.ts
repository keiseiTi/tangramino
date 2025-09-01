import type { Listener, ListenerMap } from './';

export const Event = {
  on: (
    listenerMap: ListenerMap,
    namespace: string,
    eventName: string,
    listener: Listener,
  ): void => {
    const event_name: string = namespace + '/' + eventName;
    listenerMap[event_name] = listenerMap[event_name] || [];
    listenerMap[event_name].push(listener);
  },
  once: (
    listenerMap: ListenerMap,
    namespace: string,
    eventName: string,
    listener: Listener,
  ): void => {
    const event_name: string = namespace + '/' + eventName;
    listenerMap[event_name] = listenerMap[event_name] || [];
    const fn = (...args: unknown[]) => {
      listener(...args);
      Event.off(listenerMap, namespace, eventName, fn);
    };
    listenerMap[event_name].push(fn);
  },
  emit: (
    listenerMap: ListenerMap,
    namespace: string,
    eventName: string,
    ...args: unknown[]
  ): void => {
    const event_name: string = namespace + '/' + eventName;
    (listenerMap[event_name] || []).forEach((listener) => {
      listener(...args);
    });
  },
  off: (
    listenerMap: ListenerMap,
    namespace: string,
    eventName: string,
    listener: Listener,
  ): void => {
    const event_name: string = namespace + '/' + eventName;
    if (listenerMap[event_name]) {
      const fnIndex = listenerMap[event_name].findIndex(
        (fn) => fn === listener,
      );
      listenerMap[event_name].splice(fnIndex, 1);
    }
  },
  offAll: (
    listenerMap: ListenerMap,
    namespace: string,
    eventName: string,
  ): void => {
    const event_name: string = namespace + '/' + eventName;
    listenerMap[event_name] = [];
  },
  subscribe: (
    listenerMap: ListenerMap,
    name: string,
    callback: Listener,
  ): (() => void) => {
    listenerMap[name] = listenerMap[name] || [];
    listenerMap[name].push(callback);
    return () => {
      listenerMap[name] = [];
    };
  },
};
