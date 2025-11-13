import React, { useEffect, useState } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore, usePluginCore } from '@tangramino/core';
import { Input, Radio, Checkbox, Select, Switch, Tabs, Form, InputNumber, ColorPicker } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { cn } from '@/utils';
import type { ActiveElement, Method } from '@tangramino/core';
import type {
  AttributeConfig,
  RadioAttributeConfig,
  CheckboxAttributeConfig,
  SelectAttributeConfig,
  CustomAttributeConfig,
  PanelConfig,
} from '@/interfaces/material';
import type { FlowGraphData } from '@tangramino/flow-editor';
import { useEditorContext } from '@/hooks/use-editor-context';

export const AttributePanel = () => {
  const { activeElement, setActiveElement, engine, schema, setSchema } = useEditorCore();
  const { beforeSetElementProps, afterSetElementProps } = usePluginCore();
  const { setFlowGraphData, setActiveElementEvent, setMode } = useEditorContext();
  const [activePanel, setActivePanel] = useState<string>('0');
  const [form] = Form.useForm();

  const material = activeElement?.material;
  const methods = material?.contextConfig?.methods;

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

  const selectElementMethod = (method: Method) => {
    const elementId = activeElement!.id;
    const flowGraphData = SchemaUtils.getFlowGraph<FlowGraphData>(
      schema!,
      `${elementId}::${method.name}`,
    );
    setFlowGraphData(flowGraphData);
    setActiveElementEvent({ elementId, method, material: material! });
    setMode('logic');
  };

  const onValuesChange = (changedFields: Record<string, unknown>) => {
    beforeSetElementProps(schema, activeElement!.id, changedFields);
    const newSchema = SchemaUtils.setElementProps(schema, activeElement!.id, changedFields);
    afterSetElementProps(newSchema);
    setSchema(newSchema);
  };

  const renderLabel = (label: React.ReactNode) => {
    return typeof label === 'string' ? <span className='text-xs'>{label}</span> : label;
  };

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

  const renderMaterialMethods = (): React.ReactElement[] => {
    return (
      methods?.map((method) => (
        <div
          key={method.name}
          className='mb-2 bg-gray-100 py-1 px-2 cursor-pointer rounded'
          onClick={() => selectElementMethod(method)}
        >
          <div className=' text-gray-800'>{method.name}</div>
          <div className='text-xs  text-gray-400'>{method.description}</div>
        </div>
      )) || []
    );
  };

  const renderPanelConfig = (config: PanelConfig[]) => {
    const tabsItems = config.map((item, index) => ({
      key: String(index),
      label: <div className='px-2'>{item.title}</div>,
      style: {
        padding: '0 8px',
      },
      children: item.configs?.map(renderFormItem),
    }));

    if (methods?.length) {
      tabsItems.push({
        key: 'event',
        label: <div className='px-2'>事件</div>,
        style: {
          padding: '0 8px',
        },
        children: renderMaterialMethods(),
      });
    }

    return (
      <Form form={form} onValuesChange={onValuesChange}>
        <Tabs
          size='small'
          activeKey={activePanel}
          tabBarGutter={4}
          onChange={setActivePanel}
          items={tabsItems}
        />
      </Form>
    );
  };

  return (
    <div className={cn('w-72 border-l-1 border-gray-200 bg-white flex flex-col shadow-sm')}>
      {activeElement ? (
        <>
          <div className='border-b border-gray-200 h-12 px-3 text-sm flex items-center text-stone-600 gap-1'>
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
          <div className='flex-1 overflow-auto p-2'>
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
