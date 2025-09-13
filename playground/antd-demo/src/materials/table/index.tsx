import React from 'react';
import { Table as AntdTable, type TableProps } from 'antd';

export type IProps = TableProps<any> & {
  margin?: number | string;
  padding?: number | string;
};

export const Table = (props: IProps) => {
  const { margin, padding, ...restProps } = props;
  return (
    <AntdTable
      style={{ margin, padding }}
      {...restProps}
    />
  );
};
