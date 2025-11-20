import React from 'react';
import { Table as AntdTable, type TableProps } from 'antd';

export type IProps = TableProps<any> & {
};

export const Table = (props: IProps) => {
  const { ...restProps } = props;
  return (
    <AntdTable
      {...restProps}
    />
  );
};
