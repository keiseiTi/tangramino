import React, { act, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useEditorStore, type activeElement } from '../hooks/editor';
import { cn } from '../utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type {
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
} from '../interface/editor-config';
import { SchemaUtils } from '@tangramino/engine';

interface AttributePanelProps {
  className?: string;
}

const renderLabel = (props: { label?: React.ReactNode; field?: string; className?: string }) => {
  const { label, field, className } = props;
  if (label) {
    return (
      <Label className={cn('w-16 text-stone-800 font-normal', className)} htmlFor={field}>
        {label}
      </Label>
    );
  }
  return null;
};

export const AttributePanel = (props: AttributePanelProps) => {
  const { className } = props;
  const { activeElement, setActiveElement, engine, schema, setSchema } = useEditorStore();
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

  const selectedParentElement = (element: activeElement) => {
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
    const newSchema = SchemaUtils.setElementProps(schema, activeElement!.id, {
      [field]: value,
    });
    setSchema(newSchema);
  };

  const renderTextConfig = (config: TextAttributeConfig) => {
    const { field } = config;
    return (
      <div className='flex mb-4' key={field}>
        {renderLabel(config)}
        <span className='flex-1'>{attributeValue[field] as string}</span>
      </div>
    );
  };

  const renderInputConfig = (config: InputAttributeConfig | NumberAttributeConfig) => {
    const { field } = config;
    return (
      <div className='flex mb-4' key={field}>
        {renderLabel(config)}
        <Input
          type={config.uiType === 'number' ? 'number' : 'text'}
          id={field}
          className='flex-1 h-8'
          value={(attributeValue[config.field] ?? '') as string}
          onChange={(e) => {
            let nextValue;
            if (e.target.value) {
              nextValue = config.uiType === 'number' ? Number(e.target.value) : e.target.value;
            }
            setElementProps(config.field, nextValue);
          }}
        />
      </div>
    );
  };

  const renderRadioConfig = (config: RadioAttributeConfig) => {
    const { field, props } = config;
    return (
      <div className='flex mb-4' key={field}>
        {renderLabel({
          label: config.label,
        })}
        <RadioGroup className='flex-1 flex flex-wrap gap-2'>
          {props?.options?.map((option) => (
            <div key={option.value} className='flex gap-2'>
              <RadioGroupItem id={option.value} value={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  const renderCheckboxConfig = (config: CheckboxAttributeConfig) => {
    const { field, props } = config;
    if (Array.isArray(props?.options) && props?.options.length) {
      return (
        <div className='flex mb-4' key={field}>
          {renderLabel({
            label: config.label,
          })}
          <div className='flex-1 flex flex-wrap gap-2'>
            {props?.options.map((option) => (
              <div key={option.value} className='flex gap-2'>
                <Checkbox
                  id={option.value}
                  checked={(attributeValue[field] as string[])?.includes(option.value) ?? false}
                  onCheckedChange={(checked) =>
                    setCheckboxValue(config.field, option.value, checked)
                  }
                />
                {renderLabel({
                  label: option.label,
                  field: option.value,
                  className: 'w-fit',
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className='flex mb-4' key={field}>
        {props?.labelPlacement !== 'right' && renderLabel(config)}
        {
          <Checkbox
            id={field}
            checked={(attributeValue[field] ?? null) as boolean}
            onCheckedChange={(checked) => setElementProps(config.field, checked)}
          />
        }
        {props?.labelPlacement === 'right' &&
          renderLabel({
            label: config.label,
            field,
            className: 'ml-2',
          })}
      </div>
    );
  };

  const renderSelectConfig = (config: SelectAttributeConfig) => {
    const { field, props } = config;
    return (
      <div className='flex mb-4' key={field}>
        {renderLabel(config)}
        <Select
          value={(attributeValue[field] ?? null) as string}
          onValueChange={(value) => setElementProps(field, value)}
        >
          <SelectTrigger className='flex-1' size='sm'>
            <SelectValue placeholder={props?.placeholder} />
          </SelectTrigger>
          {props?.options && (
            <SelectContent>
              {props?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
      </div>
    );
  };

  const renderSwitchConfig = (config: SwitchAttributeConfig) => {
    const { field } = config;
    return (
      <div className='flex mb-4' key={field}>
        {renderLabel(config)}
        <Switch
          id={field}
          checked={(attributeValue[config.field] ?? null) as boolean}
          onCheckedChange={(checked) => setElementProps(config.field, checked)}
        />
      </div>
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
      <div className='flex mb-4' key={field}>
        {renderLabel(config)}
        {render?.(props)}
      </div>
    );
  };

  const renderAttrConfig = (config: AttributeConfig) => {
    if (config.uiType === 'text') {
      return renderTextConfig(config);
    }
    if (config.uiType === 'number' || config.uiType === 'input') {
      return renderInputConfig(config);
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
      <Tabs value={activePanel} onValueChange={setActivePanel}>
        <TabsList>
          {config.map((item, index) => (
            <TabsTrigger
              key={String(index)}
              value={String(index)}
              className='text-stone-800 font-normal'
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {config.map((item, index) => (
          <TabsContent key={String(index)} value={String(index)}>
            {item.configs?.map(renderAttrConfig)}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  return (
    <div className={cn('w-70 border-l-1 border-gray-200', className)}>
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
                <ChevronRight className='mx-1' size={16} color='#79716b' />
              </div>
            ))}
            <span className='cursor-pointer'>{material?.title}</span>
          </div>
          <div className='p-2'>
            {material?.editorConfig?.panels && renderPanelConfig(material?.editorConfig?.panels)}
            {material?.editorConfig?.attributeConfigs &&
              !material?.editorConfig?.panels &&
              (material?.editorConfig?.attributeConfigs || []).map(renderAttrConfig)}
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
