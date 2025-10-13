import { DatePicker } from './index';
import type { Material } from '@/interfaces/material';

const DatePickerMaterial: Material = {
  Component: DatePicker,
  title: '日期选择器',
  type: 'datePicker',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '格式',
            field: 'format',
            uiType: 'input',
          },
          {
            label: '占位符',
            field: 'placeholder',
            uiType: 'input',
          },
          {
            label: '允许清除',
            field: 'allowClear',
            uiType: 'switch',
          },
          {
            label: '禁用',
            field: 'disabled',
            uiType: 'switch',
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: '大', value: 'large' },
                { label: '中', value: 'middle' },
                { label: '小', value: 'small' },
              ],
            },
          },
          {
            label: '弹层类名',
            field: 'popupClassName',
            uiType: 'input',
          },
          {
            label: '弹层对齐',
            field: 'placement',
            uiType: 'select',
            props: {
              options: [
                { label: '左下', value: 'bottomLeft' },
                { label: '右下', value: 'bottomRight' },
                { label: '左上', value: 'topLeft' },
                { label: '右上', value: 'topRight' },
              ],
            },
          },
        ],
      },
      {
        title: '样式',
        configs: [
          {
            label: '外边距',
            field: 'margin',
            uiType: 'number',
          },
          {
            label: '内边距',
            field: 'padding',
            uiType: 'number',
          },
        ],
      },
    ],
  },
};

export default DatePickerMaterial;
