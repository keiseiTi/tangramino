import { createDraft, enableMapSet, finishDraft } from 'immer';
import { defaultSchema, ELEMENT_UPDATE, VIEW_UPDATE } from './constant';
import { parse, producer, SchemaUtils } from './utils';
import { Event } from './event';
import type { Schema, Engine, ListenerMap, State } from './';

enableMapSet();

export const createEngine = (schema?: Schema): Engine => {
  const { elements, layout, extensions, flows, bindElements } = parse(schema || defaultSchema);
  const listenerMap: ListenerMap = {};

  const engine: Engine = {
    elements: producer(elements),
    layouts: producer(layout),
    extensions: producer(extensions),
    injectionCallback: {},
    contextValues: {},
    setState: (state) => {
      engine.elements = createDraft(engine.elements);
      Object.keys(state || {}).forEach((id: string) => {
        const element = engine.elements[id];
        if (element) {
          element.props = {
            ...element.props,
            ...state[id],
          };
        }
      });
      engine.elements = finishDraft(engine.elements);
      listenerMap[ELEMENT_UPDATE]?.forEach?.((listener) => {
        listener();
      });
    },
    getState: (id?: string) => {
      if (id) {
        return engine.elements[id] ? engine.elements[id].props : null;
      } else {
        const allState: State = {};
        Object.keys(engine.elements).forEach((id) => {
          allState[id] = engine.elements[id]!.props;
        });
        return allState;
      }
    },
    setExtensions: (field, value) => {
      engine.extensions = createDraft(engine.extensions);
      engine.extensions[field] = value;
      engine.extensions = finishDraft(engine.extensions);
    },
    getExtensions: (field) => {
      return engine.extensions[field];
    },
    showElements: (ids) => {
      engine.elements = createDraft(engine.elements);
      ids.forEach((id) => {
        if (engine.elements[id]) {
          engine.elements[id].hidden = false;
        }
      });
      engine.elements = finishDraft(engine.elements);
      listenerMap[ELEMENT_UPDATE]?.forEach?.((listener) => {
        listener();
      });
    },
    hiddenElements: (ids) => {
      engine.elements = createDraft(engine.elements);
      ids.forEach((id) => {
        if (engine.elements[id]) {
          engine.elements[id].hidden = true;
        }
      });
      engine.elements = finishDraft(engine.elements);
      listenerMap[ELEMENT_UPDATE]?.forEach?.((listener) => {
        listener();
      });
    },
    setGlobalVariable: (field, value) => {
      engine.setContextValue('globalVariables', {
        ...engine.contextValues['globalVariables'],
        [field]: value,
      });
    },
    getGlobalVariable: (field) => {
      return engine.contextValues['globalVariables']?.[field];
    },
    injectCallback: (id, name, callback) => {
      engine.injectionCallback = createDraft(engine.injectionCallback);
      engine.injectionCallback[id] = engine.injectionCallback[id] || {};
      engine.injectionCallback[id][name] = engine.injectionCallback[id][name] || [];
      engine.injectionCallback[id][name].push(callback);
      engine.injectionCallback = finishDraft(engine.injectionCallback);
    },
    on: (namespace, eventName, listener) => {
      Event.on(listenerMap, namespace, eventName, listener);
    },
    once: (namespace, eventName, listener) => {
      Event.once(listenerMap, namespace, eventName, listener);
    },
    emit: (namespace, eventName, ...args) => {
      Event.emit(listenerMap, namespace, eventName, ...args);
    },
    off: (namespace, eventName, listener) => {
      Event.off(listenerMap, namespace, eventName, listener);
    },
    offAll: (namespace, eventName) => {
      Event.offAll(listenerMap, namespace, eventName);
    },
    subscribe: (eventName, listener) => {
      return Event.subscribe(listenerMap, eventName, listener);
    },
    changeSchema: (schema: Schema) => {
      const { elements, layout, extensions } = parse(schema);
      engine.elements = producer(elements);
      engine.layouts = producer(layout);
      engine.extensions = producer(extensions);
      listenerMap[VIEW_UPDATE]?.forEach?.((listener) => {
        listener();
      });
    },
    getSchema: () => {
      return SchemaUtils.combineSchema(
        engine.elements,
        engine.layouts,
        engine.extensions,
        flows || {},
        bindElements || [],
      );
    },
    getElements: () => {
      return Object.entries(engine.elements).map(([id, element]) => ({
        id,
        type: element.type,
        props: element.props,
      }));
    },
    setContextValue: (field, value) => {
      engine.contextValues[field] = {
        ...engine.contextValues[field],
        ...value,
      };
    },
    getContextValue: (field) => {
      return engine.contextValues[field];
    },
  };

  return engine;
};
