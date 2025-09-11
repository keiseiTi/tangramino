import React from 'react';
import { type Material } from '@tangramino/core';
import { Tabs as AntdTabs, type TabsProps } from 'antd';

export type IProps = TabsProps;

export const Tabs = (props: IProps) => {
  return <AntdTabs {...props} />;
};

const TabsMaterial: Material = {
  Component: Tabs,
  title: '标签选型卡',
  type: 'tabs',
  editorConfig: {
    panels: [
      {
        title: '基础',
        configs: [
          { label: '激活键', field: 'activeKey', uiType: 'input' },
          { label: '默认激活键', field: 'defaultActiveKey', uiType: 'input' },
          {
            label: '类型',
            field: 'type',
            uiType: 'radio',
            props: {
              options: [
                { label: 'line', value: 'line' },
                { label: 'card', value: 'card' },
                { label: 'editable-card', value: 'editable-card' },
              ],
            },
          },
          {
            label: '大小',
            field: 'size',
            uiType: 'radio',
            props: {
              options: [
                { label: 'large', value: 'large' },
                { label: 'middle', value: 'middle' },
                { label: 'small', value: 'small' },
              ],
            },
          },
          {
            label: '位置',
            field: 'tabPosition',
            uiType: 'select',
            props: {
              options: [
                { label: 'top', value: 'top' },
                { label: 'right', value: 'right' },
                { label: 'bottom', value: 'bottom' },
                { label: 'left', value: 'left' },
              ],
            },
          },
          { label: '居中', field: 'centered', uiType: 'switch' },
          { label: '销毁隐藏面板', field: 'destroyInactiveTabPane', uiType: 'switch' },
          { label: '页签项(items)', field: 'items', uiType: 'input' },
        ],
      },
    ],
  },
};

export default TabsMaterial;
