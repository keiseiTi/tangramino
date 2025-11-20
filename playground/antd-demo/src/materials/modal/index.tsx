import React from 'react';
import { Modal as AntdModal, type ModalProps } from 'antd';

export type IProps = ModalProps & {
};

export const Modal = (props: IProps) => {
  const { children, ...restProps } = props;
  return (
    <AntdModal
      {...restProps}
    >
      {children}
    </AntdModal>
  );
};
