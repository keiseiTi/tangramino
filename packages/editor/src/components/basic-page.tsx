import React from 'react';
import type { Material } from '../interface/material';

interface BasicPageProps {
  children: React.ReactNode;
  dropPlaceholder?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
}

export const BasicPage = (props: BasicPageProps) => {
  const { children, dropPlaceholder, margin, padding } = props;
  return (
    <div className='bg-white overflow-auto shadow-xs' style={{ margin, padding }}>
      {children}
      {dropPlaceholder}
    </div>
  );
};

const BasicPageMaterial: Material = {
  title: '页面',
  type: 'basicPage',
  isContainer: true,
  Component: BasicPage as React.ComponentType,
  editorConfig: {
    panels: [
      {
        title: '基础配置',
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

export default BasicPageMaterial;
