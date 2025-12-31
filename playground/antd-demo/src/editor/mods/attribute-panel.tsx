import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { SchemaUtils } from '@tangramino/engine';
import { useEditorCore, usePluginCore } from '@tangramino/base-editor';
import { Input, Radio, Checkbox, Select, Switch, Tabs, Form, InputNumber } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { ColorPicker } from '@/components/color-picker';
import type { ActiveElement, Method } from '@tangramino/base-editor';
import type {
  AttributeConfig,
  CheckboxAttributeConfig,
  CustomAttributeConfig,
} from '@/interfaces/material';
import { useLogicEvent } from '@/hooks/use-logic-event';

export const AttributePanel = () => {
  const { activeElement, setActiveElement, engine, schema, setSchema } = useEditorCore();
  const { callSchemaHook } = usePluginCore();
  const [activePanel, setActivePanel] = useState<string>('0');
  const [form] = Form.useForm();
  const { openFlow } = useLogicEvent();

  const material = activeElement?.material;
  const methods = material?.contextConfig?.methods;
  const panels = material?.editorConfig?.panels;

  // 判断值是否非空
  const isNotEmpty = useCallback((v: unknown): boolean => {
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }, []);

  // 评估联动显示规则
  const evaluateLinkageVisibility = useCallback(
    (config: AttributeConfig, values: Record<string, unknown>): boolean => {
      const rules = config.linkageShow;
      if (!rules || rules.length === 0) return true;
      return rules.every((rule) => {
        const rv = values[rule.field];
        if (rule.isNotEmpty) return isNotEmpty(rv);
        if (Object.prototype.hasOwnProperty.call(rule, 'value')) return rv === rule.value;
        return isNotEmpty(rv);
      });
    },
    [isNotEmpty],
  );

  useEffect(() => {
    if (activeElement) {
      const state = engine!.getState(activeElement.id);
      form.resetFields();
      form.setFieldsValue({
        elementId: activeElement.id,
        ...state,
      });
      setActivePanel('0');
    }
  }, [activeElement, engine, form]);

  const selectedParentElement = useCallback(
    (element: ActiveElement) => {
      setActiveElement(element);
    },
    [setActiveElement],
  );

  const selectElementMethod = useCallback(
    (method: Method) => {
      if (!activeElement || !material) return;
      openFlow({ elementId: activeElement.id, method, material });
    },
    [activeElement, material, openFlow],
  );

  const onValuesChange = useCallback(
    (changedFields: Record<string, unknown>) => {
      if (!activeElement) return;

      // 创建临时 operation 用于 before hook
      const tempOperation = {
        elementId: activeElement.id,
        props: changedFields,
        oldProps: {},
      };

      if (callSchemaHook('onBeforeUpdateProps', schema, tempOperation) === false) {
        return;
      }

      const setPropsResult = SchemaUtils.setElementProps(schema, activeElement.id, changedFields);
      callSchemaHook('onAfterUpdateProps', setPropsResult.schema, setPropsResult.operation);
      setSchema(setPropsResult.schema);
    },
    [activeElement, schema, callSchemaHook, setSchema],
  );

  const renderLabel = useCallback((label: React.ReactNode) => {
    return typeof label === 'string' ? <span className='text-xs'>{label}</span> : label;
  }, []);

  const renderFormItem = (config: AttributeConfig) => {
    const { field, label, uiType, required, defaultValue } = config;

    let children: React.ReactNode = null;
    let valuePropName = 'value';

    switch (uiType) {
      case 'text':
        children = (
          <Form.Item noStyle shouldUpdate>
            {() => <span>{form.getFieldValue(field) as string}</span>}
          </Form.Item>
        );
        break;
      case 'input':
        children = <Input {...config.props} />;
        break;
      case 'number':
        children = <InputNumber style={{ width: '100%' }} {...config.props} />;
        break;
      case 'radio':
        children = <Radio.Group {...config.props} />;
        break;
      case 'checkbox': {
        const checkboxConfig = config as CheckboxAttributeConfig;
        valuePropName = 'checked';
        if (Array.isArray(checkboxConfig.props?.options) && checkboxConfig.props.options.length) {
          children = <Checkbox.Group options={checkboxConfig.props.options} />;
          valuePropName = 'value';
        } else {
          children = <Checkbox {...config.props} />;
        }
        break;
      }
      case 'select':
        children = <Select {...config.props} />;
        break;
      case 'switch':
        valuePropName = 'checked';
        children = <Switch {...config.props} />;
        break;
      case 'color':
        children = <ColorPicker {...config.props} />;
        break;
      case 'custom': {
        const customConfig = config as CustomAttributeConfig;
        const CustomComp = customConfig.render;
        children = <CustomComp {...customConfig} />;
        break;
      }
      default:
        return null;
    }

    // 使用 shouldUpdate 实现联动显隐
    return (
      <Form.Item noStyle shouldUpdate key={field}>
        {() => {
          const values = form.getFieldsValue(true) as Record<string, unknown>;
          if (!evaluateLinkageVisibility(config, values)) {
            return null;
          }

          return (
            <Form.Item
              label={renderLabel(label)}
              required={required}
              name={field}
              valuePropName={valuePropName}
              initialValue={defaultValue}
            >
              {children}
            </Form.Item>
          );
        }}
      </Form.Item>
    );
  };

  // 渲染物料方法列表
  const renderMaterialMethods = useMemo(() => {
    if (!methods?.length) return null;

    return methods.map((method) => (
      <div
        key={method.name}
        className='mb-2 bg-gray-100 py-1 px-2 cursor-pointer rounded hover:bg-gray-200 transition-colors'
        onClick={() => selectElementMethod(method)}
      >
        <div className='text-gray-800'>{method.name}</div>
        <div className='text-xs text-gray-400'>{method.description}</div>
      </div>
    ));
  }, [methods, selectElementMethod]);

  // 渲染面板配置
  const tabsItems = useMemo(() => {
    if (!panels) return [];

    const items = panels.map((item, index) => ({
      key: String(index),
      label: <div className='px-2'>{item.title}</div>,
      style: { padding: '0 8px' },
      children: (item.configs as AttributeConfig[])?.map((config) => renderFormItem(config)),
    }));

    if (renderMaterialMethods) {
      items.push({
        key: 'event',
        label: <div className='px-2'>事件</div>,
        style: { padding: '0 8px' },
        children: renderMaterialMethods,
      });
    }

    return items;
  }, [panels, renderMaterialMethods]);

  return (
    <div className='w-70 border-l border-gray-200 bg-white flex flex-col shadow-sm'>
      {activeElement ? (
        <>
          <div className='border-b border-gray-200 h-9.5 px-3 text-sm flex items-center text-stone-600 gap-1 overflow-x-auto overflow-y-hidden'>
            {activeElement.parents?.map((element) => (
              <div
                key={element.id}
                className='flex items-center cursor-pointer hover:text-blue-500 transition-colors shrink-0'
                onClick={() => selectedParentElement(element)}
              >
                <span className='max-w-24 truncate' title={element.material.title}>
                  {element.material.title}
                </span>
                <RightOutlined className='mx-1 text-xs' color='#79716b' />
              </div>
            ))}
            <span className='cursor-pointer shrink-0 ' title={material?.title}>
              {material?.title}
            </span>
          </div>
          <div className='flex-1 overflow-auto p-2'>
            {tabsItems.length > 0 && (
              <Form form={form} onValuesChange={onValuesChange}>
                <Tabs
                  size='small'
                  activeKey={activePanel}
                  tabBarGutter={4}
                  onChange={setActivePanel}
                  items={tabsItems}
                />
              </Form>
            )}
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
