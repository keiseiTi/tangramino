import React, { useMemo } from 'react';
import { useEditorCore } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Form } from 'antd';
import { formConfigPanel } from '@/materials/form/config-panel';
import type { Plugin } from '@tangramino/base-editor';

const FormItem = Form.Item;

type FormItemElementProps = {
  'data-element-id'?: string;
  label?: string;
  name?: string;
  required?: boolean;
  tooltip?: string;
};

const withForm = (Component: React.ComponentType<any>) => {
  return (props: FormItemElementProps) => {
    const { label, name, required, tooltip } = props;
    const elementId = props['data-element-id'];

    const { schema } = useEditorCore();

    const isForm = useMemo(() => {
      const parents = SchemaUtils.getParents(schema, elementId as string);
      const preParent = parents[0];
      const type = schema.elements[preParent]?.type;
      return type === 'form';
    }, [schema]);

    if (isForm) {
      return (
        <FormItem label={label} name={name} required={required} tooltip={tooltip}>
          <Component {...props} />
        </FormItem>
      );
    }
    return <Component {...props} />;
  };
};

export const formPlugin = (): Plugin => ({
  id: 'form',
  editorContext: {
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        const Component = material.Component;
        material.Component = withForm(Component);
      });
    },
    activateElement: (element, parentElements) => {
      const parentElement = parentElements[parentElements.length - 1];
      if (parentElement.type === 'form') {
        const panels = element.material.editorConfig?.panels || [];
        const isAble = panels.some((panel) => panel.title === '表单项');
        if (!isAble) {
          panels.splice(1, 0, formConfigPanel);
        }
      }
    },
  },
});
