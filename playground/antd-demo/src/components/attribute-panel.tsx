import React, { useEffect, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorStore, usePluginStore } from '@tangramino/base-editor';
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
} from '@tangramino/base-editor';

export const AttributePanel = () => {
  const { activeElement, setActiveElement, engine, schema, setSchema } = useEditorStore();
  const { beforeSetElementProps, afterSetElementProps } = usePluginStore();
  const [attributeValue, setAttributeValue] = useState<Record<string, unknown>>({});
  const [activePanel, setActivePanel] = useState<string>('0');

  const material = activeElement?.material;

  useEffect(() => {
    if (activeElement) {
      const state = engine!.getState(activeElement.id);
      setAttributeValue({
        elementId: activeElement.id,
        ...state,
      });
      setActivePanel('0');
    }
  }, [activeElement, engine]);

  const selectedParentElement = (element: ActiveElement) => {
    setActiveElement(element);
  };

  const setCheckboxValue = (field: string, optionValue: string, checked: unknown) => {
    let value = (attributeValue[field] || []) as string[];
    if (checked) {
      value = value.concat(optionValue);
    } else {
      value = value.filter((item) => item !== optionValue);
    }
    setElementProps(field, value);
  };

  const setElementProps = (field: string, value: unknown) => {
    setAttributeValue((prev) => ({ ...prev, [field]: value }));
    beforeSetElementProps(schema, activeElement!.id, {
      [field]: value,
    });
    const newSchema = SchemaUtils.setElementProps(schema, activeElement!.id, {
      [field]: value,
    });
    afterSetElementProps(newSchema);
    setSchema(newSchema);
  };

  const renderTextConfig = (config: TextAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field}>
        <span>{attributeValue[field] as string}</span>
      </Form.Item>
    );
  };

  const renderInputConfig = (config: InputAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field}>
        <Input />
      </Form.Item>
    );
  };

  const renderNumberConfig = (config: NumberAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field}>
        <InputNumber />
      </Form.Item>
    );
  };

  const renderRadioConfig = (config: RadioAttributeConfig) => {
    const { field, props } = config;
    return (
      <Form.Item label={config.label} name={field}>
        <Radio.Group options={props?.options}></Radio.Group>
      </Form.Item>
    );
  };

  const renderCheckboxConfig = (config: CheckboxAttributeConfig) => {
    const { field, props } = config;
    if (Array.isArray(props?.options) && props?.options.length) {
      return (
        <Form.Item label={config.label} name={field}>
          <Checkbox.Group options={props?.options}></Checkbox.Group>
        </Form.Item>
      );
    }
    return (
      <Form.Item label={config.label} name={field}>
        <Checkbox></Checkbox>
      </Form.Item>
    );
  };

  const renderSelectConfig = (config: SelectAttributeConfig) => {
    const { field, props } = config;
    return (
      <Form.Item label={config.label} name={field}>
        <Select options={props?.options} placeholder={props?.placeholder}></Select>
      </Form.Item>
    );
  };

  const renderSwitchConfig = (config: SwitchAttributeConfig) => {
    const { field } = config;
    return (
      <Form.Item label={config.label} name={field}>
        <Switch />
      </Form.Item>
    );
  };

  const renderCustomConfig = (config: CustomAttributeConfig) => {
    const { field, render } = config;
    const props = {
      ...config,
      value: attributeValue[field],
      onChange: (value: unknown) => setElementProps(field, value),
    };
    return (
      <Form.Item label={config.label} name={field}>
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
      <Form>
        <Tabs activeKey={activePanel} onChange={setActivePanel}>
          {config.map((item, index) => (
            <Tabs.TabPane key={String(index)} tab={item.title}>
              {item.configs?.map(renderAttrConfig)}
            </Tabs.TabPane>
          ))}
        </Tabs>
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
          <div className='p-2'>
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
