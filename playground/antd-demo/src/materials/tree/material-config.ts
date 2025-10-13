import { Tree } from './index';
import type { Material } from '@/interfaces/material';

const TreeMaterial: Material = {
  Component: Tree,
  title: '树',
  type: 'tree',
  editorConfig: {
    panels: [
      {
        title: '属性',
        configs: [
          {
            label: '可选中',
            field: 'checkable',
            uiType: 'switch',
          },
          {
            label: '多选',
            field: 'multiple',
            uiType: 'switch',
          },
          {
            label: '默认展开所有',
            field: 'defaultExpandAll',
            uiType: 'switch',
          },
          {
            label: '默认展开键',
            field: 'defaultExpandedKeys',
            uiType: 'input',
          },
          {
            label: '选中键',
            field: 'checkedKeys',
            uiType: 'input',
          },
          {
            label: '严格选中',
            field: 'checkStrictly',
            uiType: 'switch',
          },
          {
            label: '显示线',
            field: 'showLine',
            uiType: 'switch',
          },
          {
            label: '可拖拽',
            field: 'draggable',
            uiType: 'switch',
          },
          {
            label: '字段映射',
            field: 'fieldNames',
            uiType: 'input',
          },
          {
            label: '节点数据',
            field: 'treeData',
            uiType: 'input',
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

export default TreeMaterial;
