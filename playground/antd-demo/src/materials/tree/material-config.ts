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
            uiType: 'checkbox',
          },
          {
            label: '多选',
            field: 'multiple',
            uiType: 'checkbox',
          },
          {
            label: '默认展开所有',
            field: 'defaultExpandAll',
            uiType: 'checkbox',
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
            uiType: 'checkbox',
          },
          {
            label: '显示线',
            field: 'showLine',
            uiType: 'checkbox',
          },
          {
            label: '可拖拽',
            field: 'draggable',
            uiType: 'checkbox',
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
      
    ],
  },
};

export default TreeMaterial;
