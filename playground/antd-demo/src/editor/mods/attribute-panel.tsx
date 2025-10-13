import React, { useEffect, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore, usePluginStore } from '@tangramino/core';
import { Input, Radio, Checkbox, Select, Switch, Tabs, Form, InputNumber, ColorPicker } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { cn } from '@/utils';
import type { ActiveElement } from '@tangramino/core';
import type {
  AttributeConfig,
  RadioAttributeConfig,
  CheckboxAttributeConfig,
  SelectAttributeConfig,
  CustomAttributeConfig,
  PanelConfig,
} from '@/interfaces/material';

export const AttributePanel = () => {
  const { activeElement, setActiveElement, engine, schema, setSchema } = useEditorCore();
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

  // 统一处理 Form.Item 的 label
  const renderLabel = (label: React.ReactNode) => {
    return typeof label === 'string' ? <span className='text-xs'>{label}</span> : label;
  };

  // 统一渲染各种配置的函数
  const renderFormItem = (config: AttributeConfig) => {
    const { field, label, uiType } = config;
    let children: React.ReactNode = null;

    switch (uiType) {
      case 'text':
        children = <span>{form.getFieldValue(field) as string}</span>;
        break;
      case 'input':
        children = <Input />;
        break;
      case 'number':
        children = <InputNumber style={{ width: '100%' }} />;
        break;
      case 'radio':
        children = <Radio.Group options={(config as RadioAttributeConfig).props?.options} />;
        break;
      case 'checkbox':
        const checkboxConfig = config as CheckboxAttributeConfig;
        if (Array.isArray(checkboxConfig.props?.options) && checkboxConfig.props?.options.length) {
          children = <Checkbox.Group options={checkboxConfig.props.options} />;
        } else {
          children = <Checkbox />;
        }
        break;
      case 'select':
        const selectConfig = config as SelectAttributeConfig;
        children = (
          <Select
            options={selectConfig.props?.options}
            placeholder={selectConfig.props?.placeholder}
          />
        );
        break;
      case 'switch':
        children = <Switch />;
        break;
      case 'color':
        children = <ColorPicker />;
        break;
      case 'custom':
        const customConfig = config as CustomAttributeConfig;
        children = customConfig.render?.({ ...customConfig });
        break;
      default:
        return null;
    }

    return (
      <Form.Item label={renderLabel(label)} name={field} key={field}>
        {children}
      </Form.Item>
    );
  };

  const renderPanelConfig = (config: PanelConfig[]) => {
    return (
      <Form form={form} onValuesChange={onValuesChange}>
        <Tabs
          size='small'
          activeKey={activePanel}
          tabBarGutter={4}
          onChange={setActivePanel}
          items={config.map((item, index) => ({
            key: String(index),
            label: <div className='px-2'>{item.title}</div>,
            style: {
              padding: '0 8px',
            },
            children: item.configs?.map(renderFormItem),
          }))}
        />
      </Form>
    );
  };

  return (
    <div className={cn('w-70 border-l-1 border-gray-200 flex flex-col')}>
      {activeElement ? (
        <>
          <div className='border-b border-gray-200 h-10 px-2 text-sm flex items-center text-stone-600'>
            {activeElement.parents?.map((element) => (
              <div
                key={element.id}
                className='flex items-center cursor-pointer hover:text-blue-500'
                onClick={() => selectedParentElement(element)}
              >
                <span>{element.material.title}</span>
                <RightOutlined className='mx-1 text-xs' color='#79716b' />
              </div>
            ))}
            <span className='cursor-pointer'>{material?.title}</span>
          </div>
          <div className='flex-1 overflow-auto'>
            {material?.editorConfig?.panels &&
              renderPanelConfig(material?.editorConfig?.panels as PanelConfig[])}
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
