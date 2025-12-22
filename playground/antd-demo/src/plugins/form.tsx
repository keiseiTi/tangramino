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
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const withForm = (Component: React.ComponentType<any>, materialType: string) => {
  const isRadioOrCheckbox = materialType === 'radio' || materialType === 'checkbox';
  return React.forwardRef<HTMLDivElement, FormItemElementProps>((props, ref) => {
    const { label, name, required, tooltip, ...restProps } = props;
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
        <FormItem
          label={label}
          name={name}
          required={required}
          tooltip={tooltip}
          valuePropName={isRadioOrCheckbox ? 'checked' : 'value'}
        >
          <Component {...restProps} />
        </FormItem>
      );
    }
    return <Component {...props} ref={ref} />;
  });
};

export const formPlugin = (): Plugin => ({
  id: 'form',
  editorContext: {
    beforeInitMaterials: (materials) => {
      materials.forEach((material) => {
        const Component = material.Component;
        material.Component = withForm(Component, material.type);
      });
    },
    activateElement: (element, parentElements) => {
      if (parentElements.length) {
        const parentElement = parentElements[0];
        if (parentElement.type === 'form') {
          const panels = element.material.editorConfig?.panels || [];
          const isAble = panels.some((panel) => panel.title === '表单项');
          if (!isAble) {
            panels.splice(1, 0, formConfigPanel);
          }
        }
      }
    },
  },
});
