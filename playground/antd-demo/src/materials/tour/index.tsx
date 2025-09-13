import React from 'react';
import { Tour, type TourProps } from 'antd';

export type IProps = TourProps & {
  margin?: number | string;
  padding?: number | string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: number | string;
};

export const TourComponent = (props: IProps) => {
  const {
    margin,
    padding,
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    style,
    ...restProps
  } = props;

  const customStyle = {
    margin,
    padding,
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    ...style,
  };

  return (
    <Tour
      style={customStyle}
      {...restProps}
    />
  );
};
