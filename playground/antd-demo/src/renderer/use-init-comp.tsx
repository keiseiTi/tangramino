import React, { useEffect, useMemo } from 'react';

export const useInitComp = (components: { [key: string]: React.ComponentType<any> }) => {
  return useMemo(() => {
    return Object.keys(components).reduce(
      (acc, key) => {
        acc[key] = withComponent(components[key]);
        return acc;
      },
      {} as { [key: string]: React.ComponentType<any> },
    );
  }, []);
};

const withComponent = (component: React.ComponentType<any>) => {
  const Comp = component;
  return (props: { init: () => void; [key: string]: unknown }) => {
    const { init, ...rest } = props;

    useEffect(() => {
      init?.();
    }, []);
    return <Comp {...rest} />;
  };
};
