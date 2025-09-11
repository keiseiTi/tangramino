import React from 'react';
import { type Material } from '@tangramino/core';
import { DatePicker as AntdDatePicker, type DatePickerProps } from 'antd';

export type IProps = DatePickerProps;

export const DatePicker = (props: IProps) => {
  return <AntdDatePicker {...props} />;
};

const DatePickerMaterial: Material = {
  Component: DatePicker,
  title: '日期选择器',
  type: 'datePicker',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '格式', field: 'format', uiType: 'input' },
          { label: '占位符', field: 'placeholder', uiType: 'input' },
          { label: '允许清除', field: 'allowClear', uiType: 'switch' },
          { label: '禁用', field: 'disabled', uiType: 'switch' },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: { options: [
              { label: 'large', value: 'large' },
              { label: 'middle', value: 'middle' },
              { label: 'small', value: 'small' },
            ] },
          },
          { label: '边框', field: 'bordered', uiType: 'switch' },
          { label: '弹层类名', field: 'popupClassName', uiType: 'input' },
          {
            label: '弹层对齐',
            field: 'placement',
            uiType: 'select',
            props: { options: [
              { label: 'bottomLeft', value: 'bottomLeft' },
              { label: 'bottomRight', value: 'bottomRight' },
              { label: 'topLeft', value: 'topLeft' },
              { label: 'topRight', value: 'topRight' },
            ] },
          },
        ],
      },
    ],
  },
};

export default DatePickerMaterial;
