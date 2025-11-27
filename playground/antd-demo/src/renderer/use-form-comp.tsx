import React, { useMemo } from 'react';
import { Form } from 'antd';
import { SchemaUtils, type Schema } from '@tangramino/engine';
import type { Rule } from 'antd/es/form';

const FormItem = Form.Item;

export const useFormComp = (
  components: { [key: string]: React.ComponentType<any> },
  schema: Schema,
) => {
  return useMemo(() => {
    return Object.keys(components).reduce(
      (acc, key) => {
        acc[key] = withFormItemComponent(components[key], schema);
        return acc;
      },
      {} as { [key: string]: React.ComponentType<any> },
    );
  }, []);
};

type FormItemElementProps = {
  'data-element-id'?: string;
  label?: string;
  name?: string;
  required?: boolean;
  tooltip?: string;
  rules?: Rule[];
};

const withFormItemComponent = (component: React.ComponentType<any>, schema: Schema) => {
  const Comp = component;
  return (props: FormItemElementProps) => {
    const { label, name, required, tooltip, rules } = props;
    const elementId = props['data-element-id'] as string;

    const isForm = useMemo(() => {
      const parents = SchemaUtils.getParents(schema, elementId as string);
      const preParent = parents[0];
      const type = schema.elements[preParent]?.type;
      return type === 'form';
    }, [schema]);

    if (isForm) {
      return (
        <FormItem label={label} name={name} required={required} tooltip={tooltip} rules={rules}>
          <Comp {...props} />
        </FormItem>
      );
    }
    return <Comp {...props} />;
  };
};
