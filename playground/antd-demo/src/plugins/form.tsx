import React, { useMemo } from 'react';
import { useEditorCore } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Form } from 'antd';
import type { Plugin } from '@tangramino/base-editor';

const FormItem = Form.Item;

type FormItemElementProps = {
  'data-element-id'?: string;
  label?: string;
  name?: string;
  required?: boolean;
};

const withForm = (Component: React.ComponentType<any>) => {
  return (props: FormItemElementProps) => {
    const { label, name, required } = props;
    const elementId = props['data-element-id'];

    const { schema } = useEditorCore();

    const isFormInline = useMemo(() => {
      const parents = SchemaUtils.getParents(schema, elementId as string);
      const preParent = parents[0];
      const type = schema.elements[preParent]?.type;
      return type === 'form';
    }, [schema]);

    if (isFormInline) {
      return (
        <FormItem label={label} name={name} required={required}>
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
  },
});
