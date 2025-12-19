import React, { useMemo } from 'react';
import { ReactView } from '@tangramino/react';
import { ElementWrapper } from './element-wrapper';
import { useEditorCore } from '../hooks/use-editor-core';
import { CanvasOverlay } from './canvas-overlay';
import type { Material, MaterialComponentProps } from '../interface/material';
import { type DropPlaceholderProps } from './placeholder';

export interface EnhancedComponentProps {
  children: React.ReactElement;
  elementProps: Record<string, unknown>;
  material: Material;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface CanvasEditorProps {
  style?: React.CSSProperties;
  className?: string;
  overlayStyle?: React.CSSProperties;
  overlayClassNames?: string;
  renderElement?: (props: EnhancedComponentProps) => React.ReactNode;
  renderDropIndicator?: (props: DropPlaceholderProps) => React.ReactNode;
  renderOverlayContent?: () => React.ReactNode;
}

export const CanvasEditor = (props: CanvasEditorProps) => {
  const {
    style,
    className,
    renderElement,
    renderDropIndicator,
    overlayStyle,
    overlayClassNames,
    renderOverlayContent,
  } = props;
  const { materials, engine } = useEditorCore();

  const components = useMemo(() => {
    return (materials || []).reduce(
      (acc, cur) => {
        if (cur.Component) {
          const Comp = cur.Component as React.ComponentType<Record<string, unknown>>;
          acc[cur.type] = (props: Record<string, unknown>) => {
            const element = (
              <ElementWrapper
                elementProps={props}
                material={cur}
                renderComponent={(extraProps: MaterialComponentProps) => {
                  return <Comp {...props} {...extraProps} />;
                }}
                renderDropIndicator={renderDropIndicator}
              />
            );
            if (renderElement) {
              return renderElement({
                children: element,
                elementProps: props,
                material: cur,
              });
            }
            return element;
          };
        }
        return acc;
      },
      {} as Record<string, React.ComponentType>,
    );
  }, [materials]);

  return (
    <div style={style} className={className} id='tgCanvasContainer'>
      <ReactView engine={engine} components={components} />
      <CanvasOverlay
        style={overlayStyle}
        className={overlayClassNames}
        renderContent={renderOverlayContent}
      />
    </div>
  );
};
