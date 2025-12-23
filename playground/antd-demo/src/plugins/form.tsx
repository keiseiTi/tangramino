import React, { useMemo } from 'react';
import { definePlugin, useEditorCore, type EditorPlugin } from '@tangramino/base-editor';
import { SchemaUtils } from '@tangramino/engine';
import { Form } from 'antd';
import { formConfigPanel } from '@/materials/form/config-panel';

const FormItem = Form.Item;

type FormItemElementProps = {
  'data-element-id'?: string;
  label?: string;
  name?: string;
  required?: boolean;
  tooltip?: string;
};

const withForm = (Component: React.ComponentType<any>) => {
  return React.forwardRef<HTMLDivElement, FormItemElementProps>((props, ref) => {
    const { label, name, required, tooltip } = props;
    const elementId = props['data-element-id'];

    const { schema } = useEditorCore();

    const isForm = useMemo(() => {
      const parents = SchemaUtils.getParents(schema, elementId as string);
      const preParent = parents[0];
      const type = schema.elements[preParent]?.type;
      return type === 'form';
    }, [schema, elementId]);

    if (isForm) {
      return (
        <FormItem label={label} name={name} required={required} tooltip={tooltip}>
          <Component {...props} />
        </FormItem>
      );
    }
    return <Component {...props} ref={ref} />;
  });
};

/**
 * Form 插件 - 为表单内的组件添加 FormItem 包装和配置面板
 */
export const formPlugin = definePlugin<EditorPlugin>(() => ({
  id: 'form',

  transformMaterials: (materials) => {
    return materials.map((material) => ({
      ...material,
      Component: withForm(material.Component),
    }));
  },

  onElementActivate(element, parentChain) {
    if (parentChain.length) {
      const hasFormParent = parentChain.some((parent) => parent.type === 'form');
      if (hasFormParent) {
        const panels = element.material.editorConfig?.panels || [];
        const hasFormPanel = panels.some((panel) => panel.title === '表单项');
        if (!hasFormPanel) {
          // 动态添加表单项配置面板
          panels.splice(1, 0, formConfigPanel);
        }
      }
    }
  },
}));
