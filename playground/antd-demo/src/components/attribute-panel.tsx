import React, { useEffect, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorStore, usePluginStore } from '@tangramino/core';
import { Input, Radio, Checkbox, Select, Switch, Tabs, Form, InputNumber } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { cn } from '../utils';
import type {
  ActiveElement,
  AttributeConfig,
  CheckboxAttributeConfig,
  PanelConfig,
  InputAttributeConfig,
  NumberAttributeConfig,
  RadioAttributeConfig,
  SelectAttributeConfig,
  SwitchAttributeConfig,
  TextAttributeConfig,
  CustomAttributeConfig,
} from '@tangramino/core';

export const AttributePanel = () => {
  const { activeElement, setActiveElement, engine, schema, setSchema } = useEditorStore();
  const { beforeSetElementProps, afterSetElementProps } = usePluginStore();
  const [activePanel, setActivePanel] = useState<string>('0');
  const [form] = Form.useForm();

  const material = activeElement?.material;

  useEffect(() => {
    if (activeElement) {
      const state = engine!.getState(activeElement.id);
      form.setFieldsValue({
        elementId: activeElement.id,
        ...state,
      });
      setActivePanel('0');
    }
  }, [activeElement, engine]);

  const selectedParentElement = (element: ActiveElement) => {
    setActiveElement(element);
  };

  const onValuesChange = (changedFields: Record<string, unknown>) => {
    beforeSetElementProps(schema, activeElement!.id, changedFields);
    const newSchema = SchemaUtils.setElementProps(schema, activeElement!.id, changedFields);
    afterSetElementProps(newSchema);
    setSchema(newSchema);
  };

  const renderTextConfig = (config: TextAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <span>{form.getFieldValue(field) as string}</span>
      </Form.Item>
    );
  };

  const renderInputConfig = (config: InputAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <Input />
      </Form.Item>
    );
  };

  const renderNumberConfig = (config: NumberAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <InputNumber />
      </Form.Item>
    );
  };

  const renderRadioConfig = (config: RadioAttributeConfig) => {
    const { field, props } = config;
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <Radio.Group options={props?.options}></Radio.Group>
      </Form.Item>
    );
  };

  const renderCheckboxConfig = (config: CheckboxAttributeConfig) => {
    const { field, props } = config;
    if (Array.isArray(props?.options) && props?.options.length) {
      return (
        <Form.Item label={config.label} name={field} key={field}>
          <Checkbox.Group options={props?.options}></Checkbox.Group>
        </Form.Item>
      );
    }
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <Checkbox></Checkbox>
      </Form.Item>
    );
  };

  const renderSelectConfig = (config: SelectAttributeConfig) => {
    const { field, props } = config;
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <Select options={props?.options} placeholder={props?.placeholder}></Select>
      </Form.Item>
    );
  };

  const renderSwitchConfig = (config: SwitchAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field} key={field}>
        <Switch />
      </Form.Item>
    );
  };

  const renderCustomConfig = (config: CustomAttributeConfig) => {
    const { field, render } = config;
    const props = {
      ...config,
    };
    return (
      <Form.Item label={config.label} name={field} key={field}>
        {render?.(props)}
      </Form.Item>
    );
  };

  const renderAttrConfig = (config: AttributeConfig) => {
    if (config.uiType === 'text') {
      return renderTextConfig(config);
    }
    if (config.uiType === 'input') {
      return renderInputConfig(config);
    }
    if (config.uiType === 'number') {
      return renderNumberConfig(config);
    }
    if (config.uiType === 'radio') {
      return renderRadioConfig(config);
    }
    if (config.uiType === 'checkbox') {
      return renderCheckboxConfig(config);
    }
    if (config.uiType === 'select') {
      return renderSelectConfig(config);
    }
    if (config.uiType === 'switch') {
      return renderSwitchConfig(config);
    }
    if (config.uiType === 'custom') {
      return renderCustomConfig(config);
    }
    return null;
  };

  const renderPanelConfig = (config: PanelConfig[]) => {
    return (
      <Form form={form} onValuesChange={onValuesChange}>
        <Tabs
          size='small'
          activeKey={activePanel}
          onChange={setActivePanel}
          items={config.map((item, index) => ({
            key: String(index),
            label: item.title,
            children: item.configs?.map(renderAttrConfig),
          }))}
        />
      </Form>
    );
  };

  return (
    <div className={cn('w-70 border-l-1 border-gray-200')}>
      {activeElement ? (
        <>
          <div className='border-b border-gray-200 p-2 text-sm flex items-center text-stone-600'>
            {activeElement.parents?.map((element) => (
              <div
                key={element.id}
                className='flex items-center cursor-pointer'
                onClick={() => selectedParentElement(element)}
              >
                <span>{element.material.title}</span>
                <RightOutlined className='mx-1' size={16} color='#79716b' />
              </div>
            ))}
            <span className='cursor-pointer'>{material?.title}</span>
          </div>
          <div className='px-2'>
            {material?.editorConfig?.panels && renderPanelConfig(material?.editorConfig?.panels)}
          </div>
        </>
      ) : (
        <div className='size-full flex justify-center text-gray-700 items-center'>
          <span>请从左侧画布选中元素</span>
        </div>
      )}
    </div>
  );
};
