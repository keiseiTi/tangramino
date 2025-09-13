import React from 'react';
import { Modal as AntdModal, type ModalProps } from 'antd';

export type IProps = ModalProps & {
  margin?: number | string;
  padding?: number | string;
};

export const Modal = (props: IProps) => {
  const { children, margin, padding, ...restProps } = props;
  return (
    <AntdModal
      style={{ margin, padding }}
      {...restProps}
    >
      {children}
    </AntdModal>
  );
};
