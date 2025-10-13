import Button from './button/material-config';
import Input from './input/material-config';
import Select from './select/material-config';
import Checkbox from './checkbox/material-config';
import Radio from './radio/material-config';
import Switch from './switch/material-config';
import Form from './form/material-config';
import Table from './table/material-config';
import Tabs from './tabs/material-config';
import Modal from './modal/material-config';
import Drawer from './drawer/material-config';
import Upload from './upload/material-config';
import DatePicker from './date-picker/material-config';
import TimePicker from './time-picker/material-config';
import Tree from './tree/material-config';
import TreeSelect from './tree-select/material-config';
import Cascader from './cascader/material-config';
import Number from './number/material-config';
import BasicPage from './basic-page/material-config';
import Container from './container/material-config';
import Text from './text/material-config';
import FloatButton from './float-button/material-config';

export const materialGroups = [
  {
    title: '布局容器',
    children: [BasicPage, Container, Form, Tabs, Modal, Drawer],
  },
  {
    title: '输入组件',
    children: [
      Input,
      Number,
      Checkbox,
      Radio,
      Select,
      Switch,
      DatePicker,
      TimePicker,
      Tree,
      TreeSelect,
      Cascader,
      Upload,
    ],
  },
  {
    title: '展示组件',
    children: [Table, Button, Text],
  },
  {
    title: '导航组件',
    children: [FloatButton],
  },
];

export default materialGroups;
