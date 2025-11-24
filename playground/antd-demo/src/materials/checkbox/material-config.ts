import { OptionsConfig } from '@/components/options-config';
import { Checkbox } from './index';
import type { Material } from '@/interfaces/material';

const CheckboxMaterial: Material = {
  Component: Checkbox as React.ComponentType,
  title: '复选框',
  type: 'checkbox',
  dropTypes: ['container', 'form'],
  defaultProps: {
    options: [
      {
        label: '示例1',
        value: '示例1',
      },
    ],
  },
  contextConfig: {
    variables: [
      {
        name: 'value',
        description: '当前值',
      },
      {
        name: 'disabled',
        description: '是否禁用',
      },
      {
        name: 'options',
        description: '选项',
      },
    ],
    methods: [
      {
        name: 'onChange',
        description: '值改变时的回调',
        params: [
          {
            description: '事件参数',
          },
        ],
      },
    ],
  },
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            field: 'options',
            uiType: 'custom',
            render: OptionsConfig,
          },
        ],
      },

    ],
  },
};

export default CheckboxMaterial;
