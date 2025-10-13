import { Select } from './index';
import type { Material } from '@/interfaces/material';

const SelectMaterial: Material = {
  Component: Select,
  title: '选择器',
  type: 'select',
  defaultProps: {
    placeholder: '请选择',
    size: 'middle',
  },
  editorConfig: {
    panels: [
      {
        title: '基础属性',
        configs: [
          {
            label: '占位符',
            field: 'placeholder',
            uiType: 'input',
            props: {
              placeholder: '请输入占位符文本',
            },
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
            label: '模式',
            field: 'mode',
            uiType: 'select',
            props: {
              options: [
                { label: '默认', value: undefined },
                { label: '多选', value: 'multiple' },
                { label: '标签', value: 'tags' },
              ],
            },
          },
          {
            label: '默认值',
            field: 'defaultValue',
            uiType: 'input',
            props: {
              placeholder: '请输入默认值',
            },
          },
          {
            label: '当前值',
            field: 'value',
            uiType: 'input',
            props: {
              placeholder: '请输入当前值',
            },
          },
        ],
      },
      {
        title: '功能属性',
        configs: [
          {
            label: '可搜索',
            field: 'showSearch',
            uiType: 'switch',
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
            label: '自动获取焦点',
            field: 'autoFocus',
            uiType: 'switch',
          },
          {
            label: '虚拟滚动',
            field: 'virtual',
            uiType: 'switch',
          },
          {
            label: '最大标签数',
            field: 'maxTagCount',
            uiType: 'number',
            props: {
              min: 0,
              max: 100,
              step: 1,
            },
          },
        ],
      },
      {
        title: '选项配置',
        configs: [
          {
            label: '选项数据',
            field: 'options',
            uiType: 'input',
            props: {
              placeholder: '[{ label: "选项1", value: "1" }, { label: "选项2", value: "2" }]',
            },
          },
          {
            label: '选项过滤',
            field: 'filterOption',
            uiType: 'switch',
          },
          {
            label: '选项排序',
            field: 'optionFilterProp',
            uiType: 'select',
            props: {
              options: [
                { label: 'label', value: 'label' },
                { label: 'value', value: 'value' },
                { label: 'children', value: 'children' },
              ],
            },
          },
        ],
      },
      {
        title: '样式配置',
        configs: [
          {
            label: '外边距',
            field: 'margin',
            uiType: 'number',
            props: {
              min: 0,
              max: 100,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '内边距',
            field: 'padding',
            uiType: 'number',
            props: {
              min: 0,
              max: 50,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '宽度',
            field: 'width',
            uiType: 'number',
            props: {
              min: 0,
              max: 500,
              step: 1,
              unit: 'px',
            },
          },
          {
            label: '背景色',
            field: 'backgroundColor',
            uiType: 'color',
          },
          {
            label: '文字颜色',
            field: 'color',
            uiType: 'color',
          },
          {
            label: '边框颜色',
            field: 'borderColor',
            uiType: 'color',
          },
          {
            label: '圆角',
            field: 'borderRadius',
            uiType: 'number',
            props: {
              min: 0,
              max: 20,
              step: 1,
              unit: 'px',
            },
          },
        ],
      },
    ],
  },
};

export default SelectMaterial;
