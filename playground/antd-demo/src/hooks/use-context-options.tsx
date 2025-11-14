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
            label: findOne.title + '(' + variable.description + ')',
            value: `state.${id}.${variable.name}`,
            name: variable.name,
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
            label: findOne.title + '(' + method.description + ')',
            value: `method.${id}.${method.name}`,
            name: method.name,
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
      })) || []
    );
  }, [schema, materials]);

  return {
    variableOptions,
    methodOptions,
    globalVariableOptions,
  };
};
