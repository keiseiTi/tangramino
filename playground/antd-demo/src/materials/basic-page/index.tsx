import React from 'react';

interface BasicPageProps {
  children: React.ReactNode;
  dropPlaceholder?: React.ReactNode;
  margin?: number | string;
  padding?: number | string;
}

export const BasicPage = (props: BasicPageProps) => {
  const { children, dropPlaceholder, margin, padding } = props;
  return (
    <div className='bg-white overflow-auto shadow-xs' style={{ margin, padding }}>
      {children}
      {dropPlaceholder}
    </div>
  );
};
