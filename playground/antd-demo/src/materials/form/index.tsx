import React, { useEffect } from 'react';
import { Form as AntdForm, type FormProps } from 'antd';
import type { MaterialComponentProps } from '@tangramino/base-editor';

export interface IProps extends FormProps, MaterialComponentProps {
  children?: React.ReactNode;
  labelColVal?: number;
  wrapperColVal?: number;
  value?: Record<string, unknown>;
}

export const Form = (props: IProps) => {
  const {
    children,
    labelColVal,
    wrapperColVal,
    value,
    tg_dropPlaceholder,
    tg_setContextValues,
    ...restProps
  } = props;
  const [form] = AntdForm.useForm();

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        ...value,
      });
    }
  }, [value]);

  useEffect(() => {
    tg_setContextValues?.({
      setFieldsValue: form.setFieldsValue,
      resetFields: form.resetFields,
    });
  }, [form]);

  const onValuesChange = (_: Record<string, unknown>, allValues: Record<string, unknown>) => {
    tg_setContextValues?.({
      value: allValues,
    });
  };

  return (
      <AntdForm
        className='h-full'
        form={form}
        onValuesChange={onValuesChange}
        labelCol={
          labelColVal
            ? {
                span: labelColVal,
              }
            : undefined
        }
        wrapperCol={
          wrapperColVal
            ? {
                span: wrapperColVal,
              }
            : undefined
        }
        {...restProps}
      >
        {children || tg_dropPlaceholder}
      </AntdForm>
  );
};
