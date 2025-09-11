import Button from './button';
import Input from './input';
import Select from './select';
import Checkbox from './checkbox';
import Radio from './radio';
import Switch from './switch';
import Form from './form';
import Table from './table';
import Tabs from './tabs';
import Modal from './modal';
import Drawer from './drawer';
import Upload from './upload';
import DatePicker from './date-picker';
import TimePicker from './time-picker';
import Tree from './tree';
import TreeSelect from './tree-select';
import Cascader from './cascader';
import Number from './number';
import BasicPage from './basic-page';
import Container from './container';
import Text from './text';

const materialGroups = [
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
    children: [Table, , Button, Text],
  },
];

export default materialGroups;
