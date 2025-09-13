import React from 'react';
import { Upload as AntdUpload, type UploadProps } from 'antd';

export type IProps = UploadProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Upload = (props: IProps) => {
  const { children, margin, padding, ...restProps } = props;
  return (
    <AntdUpload
      style={{ margin, padding }}
      {...restProps}
    >
      {children}
    </AntdUpload>
  );
};
