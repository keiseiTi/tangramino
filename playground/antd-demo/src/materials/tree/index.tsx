import React from 'react';
import { Tree as AntdTree, type TreeProps } from 'antd';

export type IProps = TreeProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Tree = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdTree
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
