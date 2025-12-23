import React, { useMemo } from 'react';
import { useEditorCore } from '@tangramino/base-editor';

export const useContextOptions = () => {
  const { schema, materials } = useEditorCore();

  const variableOptions = useMemo(() => {
    const elements = schema!.elements;
    return Object.keys(elements)
      .map((id) => {
        const element = elements[id];
        const findOne = materials.find((material) => material.type === element.type);
        if (findOne?.contextConfig?.variables) {
          return findOne.contextConfig.variables.map((variable) => ({
            label: variable.description,
            value: `state.${id}.${variable.name}`,
            name: variable.name,
            tags: [element.props?.alias as string, findOne.title, '元素'].filter(Boolean),
          }));
        }
        return [];
      })
      .flat()
      .filter((_) => _);
  }, [schema, materials]);

  const methodOptions = useMemo(() => {
    const elements = schema!.elements;
    return Object.keys(elements)
      .map((id) => {
        const element = elements[id];
        const findOne = materials.find((material) => material.type === element.type);
        if (findOne?.contextConfig?.methods) {
          return findOne.contextConfig.methods.map((method) => ({
            label: method.description,
            value: `method.${id}.${method.name}`,
            name: method.name,
            tags: [element.props?.alias as string, findOne.title, '方法'].filter(Boolean),
          }));
        }
      })
      .flat()
      .filter((_) => _);
  }, [schema, materials]);

  const globalVariableOptions = useMemo(() => {
    const context = schema!.context;
    return (
      context?.globalVariables?.map((variable) => ({
        label: variable.description,
        value: 'global.' + variable.name,
        name: variable.name,
        tags: ['全局变量'],
      })) || []
    );
  }, [schema, materials]);

  return {
    variableOptions,
    methodOptions,
    globalVariableOptions,
  };
};
