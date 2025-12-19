import React, { useEffect, useState } from 'react';
import { useEditorCore } from '../hooks/use-editor-core';
import { createPortal } from 'react-dom';

interface CanvasOverlayProps {
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
  renderContent?: (() => React.ReactNode) | undefined;
}

export const CanvasOverlay = (props: CanvasOverlayProps) => {
  const { style, className, renderContent: Content } = props;
  const activeElement = useEditorCore((state) => state.activeElement);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    if (!activeElement) {
      setRect(null);
      return;
    }

    const element = document.querySelector(`[data-element-id="${activeElement.id}"]`);
    if (element) {
      setRect(element.getBoundingClientRect());
    } else {
      setRect(null);
    }
  };

  useEffect(() => {
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);

    const observer = new ResizeObserver(updateRect);
    const tgCanvasContainer = document.querySelector('#tgCanvasContainer');
    if (tgCanvasContainer) {
      observer.observe(tgCanvasContainer);
    }

    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
      observer.disconnect();
    };
  }, [activeElement]);

  if (!rect || !activeElement) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: `translate(${rect.left}px, ${rect.top}px)`,
          width: rect.width,
          height: rect.height,
          border: '2px solid #1677ff',
          boxSizing: 'border-box',
          transition: 'all 0.1s ease-out',
          ...style,
        }}
        className={className}
      >
        {Content ? (
          <Content />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: -24,
              left: 0,
              background: '#1677ff',
              color: 'white',
              padding: '2px 8px',
              fontSize: 12,
              borderRadius: '2px 2px 0 0',
            }}
          >
            {activeElement.material.title}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};
